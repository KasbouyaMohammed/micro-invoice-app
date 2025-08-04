import { getTranslation } from './translations';

export interface WhatsAppMessageData {
  clientName: string;
  serviceDescription: string;
  totalAmount: number;
  dueDate: string;
  currency?: string;
  lineItems?: Array<{ description: string; quantity: string; unitPrice: string; tax?: string }>;
  language?: string;
  advancePercentage?: string;
  advanceAmount?: string;
  advanceType?: 'percentage' | 'amount';
  deliveryPercentage?: string;
  deliveryAmount?: string;
  deliveryType?: 'percentage' | 'amount';
  includeDelivery?: boolean;
}

export const createWhatsAppMessage = (data: WhatsAppMessageData): string => {
  const currency = data.currency || 'USD';
  const language = data.language || 'en';
  
  const getCurrencySymbol = (currencyCode: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      MAD: 'MAD'
    };
    return symbols[currencyCode] || '$';
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };

  const formattedAmount = formatCurrency(data.totalAmount, currency);
  const currencySymbol = getCurrencySymbol(currency);

  const date = new Date(data.dueDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  // Messages multilingues sans emojis
  const getMessageTemplate = (lang: string) => {
    const templates = {
      fr: {
        invoiceFor: 'Facture pour',
        items: 'Articles :',
        total: 'Total TTC :',
        due: 'Échéance :',
        thankYou: 'Merci pour votre confiance !'
      },
      en: {
        invoiceFor: 'Invoice for',
        items: 'Items:',
        total: 'Total TTC:',
        due: 'Due:',
        thankYou: 'Thank you for your business!'
      },
      ar: {
        invoiceFor: 'فاتورة لـ',
        items: 'السلع:',
        total: 'المجموع مع الضريبة:',
        due: 'الاستحقاق:',
        thankYou: 'شكراً لثقتكم!'
      }
    };
    return templates[lang as keyof typeof templates] || templates.en;
  };

  const template = getMessageTemplate(language);

  let message = `*${template.invoiceFor} ${capitalizeWords(data.clientName)}*\n\n`;

  if (data.lineItems && data.lineItems.length > 0) {
    message += `*${template.items}*\n`;
    data.lineItems.forEach(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const price = quantity * unitPrice;
      message += `• ${quantity}× ${item.description} – ${currencySymbol}${price.toFixed(2)}\n`;
    });
    message += `\n*${template.total}* ${formattedAmount}\n`;
  } else {
    message += `*${getTranslation(language, 'service')}:* ${data.serviceDescription}\n`;
    message += `*${template.total}* ${formattedAmount}\n`;
  }

  message += `*${template.due}* ${formattedDate}\n`;
  
  // Ajouter les informations d'avance et de reste si disponibles
  if (data.advancePercentage || data.advanceAmount) {
    const advanceValue = data.advanceType === 'amount' && data.advanceAmount 
      ? formatCurrency(parseFloat(data.advanceAmount), currency)
      : data.advancePercentage 
        ? `${data.advancePercentage}%`
        : '';
    
    if (advanceValue) {
      message += `*${getTranslation(language, 'advancePayment')}* ${advanceValue}\n`;
    }
  }
  
  if (data.includeDelivery && (data.deliveryPercentage || data.deliveryAmount)) {
    const deliveryValue = data.deliveryType === 'amount' && data.deliveryAmount 
      ? formatCurrency(parseFloat(data.deliveryAmount), currency)
      : data.deliveryPercentage 
        ? `${data.deliveryPercentage}%`
        : '';
    
    if (deliveryValue) {
      message += `*${getTranslation(language, 'deliveryPayment')}* ${deliveryValue}\n`;
    }
  }
  
  message += `\n*${template.thankYou}*`;

  return encodeURIComponent(message);
};

export const openWhatsApp = (message: string): void => {
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

// Nouvelle fonction pour envoyer le PDF via WhatsApp
export const sendPDFViaWhatsApp = async (pdfBlob: Blob, phoneNumber: string, message: string): Promise<void> => {
  try {
    // Créer un fichier à partir du blob
    const file = new File([pdfBlob], 'invoice.pdf', { type: 'application/pdf' });
    
    // Créer un lien temporaire pour le PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Encoder le message avec le lien du PDF
    const fullMessage = `${message}\n\n📎 PDF: ${pdfUrl}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    
    // Ouvrir WhatsApp avec le numéro et le message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Nettoyer l'URL après un délai
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 60000); // 1 minute
  } catch (error) {
    console.error('Error sending PDF via WhatsApp:', error);
    throw new Error('Failed to send PDF via WhatsApp');
  }
};

// Fonction pour créer un message WhatsApp personnalisable
export const createCustomizableWhatsAppMessage = (data: WhatsAppMessageData, customMessage?: string): string => {
  const baseMessage = createWhatsAppMessage(data);
  
  if (customMessage) {
    // Ajouter le message personnalisé au début
    const customEncoded = encodeURIComponent(customMessage);
    return `${customEncoded}%0A%0A${baseMessage}`;
  }
  
  return baseMessage;
};