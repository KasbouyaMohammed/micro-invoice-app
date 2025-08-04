import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { createWhatsAppMessage, sendPDFViaWhatsApp } from '../utils/whatsappShare';

interface WhatsAppMessageData {
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

interface WhatsAppMessageEditorProps {
  data: WhatsAppMessageData;
  onSendMessage: (message: string) => void;
  onSendPDF?: (phoneNumber: string, message: string) => Promise<void>;
  pdfBlob?: Blob;
}

const WhatsAppMessageEditor: React.FC<WhatsAppMessageEditorProps> = ({
  data,
  onSendMessage,
  onSendPDF,
  pdfBlob
}) => {
  const { t, language } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [userEdits, setUserEdits] = useState('');

  // Create a unique key for this invoice
  const getStorageKey = () => {
    const dataHash = JSON.stringify({
      clientName: data.clientName,
      serviceDescription: data.serviceDescription,
      totalAmount: data.totalAmount,
      dueDate: data.dueDate,
      lineItems: data.lineItems
    });
    return `whatsapp_message_${btoa(dataHash).slice(0, 20)}`;
  };

  // Create a key for user edits
  const getUserEditsKey = () => {
    const dataHash = JSON.stringify({
      clientName: data.clientName,
      serviceDescription: data.serviceDescription,
      totalAmount: data.totalAmount,
      dueDate: data.dueDate,
      lineItems: data.lineItems
    });
    return `whatsapp_user_edits_${btoa(dataHash).slice(0, 20)}`;
  };

  // Load or generate message
  useEffect(() => {
    const storageKey = getStorageKey();
    const userEditsKey = getUserEditsKey();
    const savedUserEdits = localStorage.getItem(userEditsKey);
    
    // Generate new base message with current language
    const baseMessage = createWhatsAppMessage(data);
    const decodedBaseMessage = decodeURIComponent(baseMessage);
    
    if (savedUserEdits) {
      // If user has made edits, append them to the new base message
      setPreviewMessage(decodedBaseMessage + '\n\n' + savedUserEdits);
      setUserEdits(savedUserEdits);
    } else {
      // Use new base message
      setPreviewMessage(decodedBaseMessage);
      setUserEdits('');
    }
    
    // Save the new base message
    localStorage.setItem(storageKey, decodedBaseMessage);
  }, [data.clientName, data.serviceDescription, data.totalAmount, data.dueDate, data.lineItems, language]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setPreviewMessage(newMessage);
    
    // Extract user edits (everything after the base message)
    const baseMessage = createWhatsAppMessage(data);
    const decodedBaseMessage = decodeURIComponent(baseMessage);
    
    let newUserEdits = '';
    if (newMessage.includes(decodedBaseMessage)) {
      // Find the part after the base message
      const baseMessageIndex = newMessage.indexOf(decodedBaseMessage);
      if (baseMessageIndex !== -1) {
        newUserEdits = newMessage.substring(baseMessageIndex + decodedBaseMessage.length).trim();
      }
    } else {
      // If base message is not found, treat the whole message as user edits
      newUserEdits = newMessage;
    }
    
    setUserEdits(newUserEdits);
    
    // Save user edits to localStorage
    const userEditsKey = getUserEditsKey();
    localStorage.setItem(userEditsKey, newUserEdits);
  };

  const handleSendMessage = () => {
    // Encoder le message édité directement
    const encodedMessage = encodeURIComponent(previewMessage);
    onSendMessage(encodedMessage);
  };

  const handleSendPDF = async () => {
    if (!phoneNumber.trim()) {
      alert(t('phoneNumberRequired'));
      return;
    }

    if (!pdfBlob) {
      alert(t('pdfNotGenerated'));
      return;
    }

    try {
      // Utiliser le message édité directement
      const encodedMessage = encodeURIComponent(previewMessage);
      await sendPDFViaWhatsApp(pdfBlob, phoneNumber, previewMessage);
    } catch (error) {
      console.error('Error sending PDF:', error);
      alert(t('pdfSendError'));
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Supprimer tous les caractères non numériques
    const cleaned = value.replace(/\D/g, '');
    
    // Formater selon le pays (exemple pour la France)
    if (cleaned.startsWith('33')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+33${cleaned.substring(1)}`;
    } else if (cleaned.length > 0) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {t('whatsappMessagePreview')}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Champ de texte éditable pour le message WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('customMessage')}
          </label>
          <textarea
            value={previewMessage}
            onChange={handleMessageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-mono text-sm"
            rows={12}
            placeholder={t('customMessagePlaceholder')}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={handleSendMessage}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send size={16} />
            {t('sendMessage')}
          </button>
          
          {pdfBlob && (
            <button
              onClick={() => setShowPhoneInput(!showPhoneInput)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone size={16} />
              {t('sendPDF')}
            </button>
          )}
        </div>

        {showPhoneInput && (
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('phoneNumber')} *
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              placeholder={t('phoneNumberPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('phoneNumberFormat')}
            </p>
            <button
              onClick={handleSendPDF}
              disabled={!phoneNumber.trim()}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {t('sendPDFViaWhatsApp')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppMessageEditor; 