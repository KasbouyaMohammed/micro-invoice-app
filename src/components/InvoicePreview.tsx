import React, { useEffect, useState } from 'react';
import { Download, MessageCircle, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import WhatsAppMessageEditor from './WhatsAppMessageEditor';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

interface InvoiceSettings {
  theme: 'professional' | 'modern' | 'minimal' | 'colorful';
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'MAD';
  showLogo: boolean;
  customFooter: string;
  documentType: 'FACTURE' | 'DEVIS';
  companyLogo?: string;
  compactMode?: boolean;
}

interface InvoiceData {
  clientName: string;
  serviceDescription: string;
  price: string;
  tax: string;
  dueDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  companyInfo: CompanyInfo;
  settings: InvoiceSettings;
  lineItems?: Array<{ description: string; quantity: string; unitPrice: string; tax?: string }>;
  useManualTotal?: boolean;
  manualTotal?: string;
  useOverallTax?: boolean;
  overallTax?: string;
  validityPeriod?: string;
  validityMonths?: string;
  paymentDetails?: string;
  advancePercentage?: string;
  advanceAmount?: string;
  advanceType?: 'percentage' | 'amount';
  deliveryPercentage?: string;
  deliveryAmount?: string;
  deliveryType?: 'percentage' | 'amount';
  includeDelivery?: boolean;
}

interface InvoicePreviewProps {
  data: InvoiceData;
  onDownloadPDF: () => void;
  onSendWhatsApp: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  isGeneratingPDF: boolean;
  pdfBlob?: Blob;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  data,
  onDownloadPDF,
  onSendWhatsApp,
  isVisible,
  onToggleVisibility,
  isGeneratingPDF,
  pdfBlob
}) => {
  // Safety check for single page layout
  const checkSinglePageFit = () => {
    const invoiceElement = document.getElementById('invoice-content');
    if (invoiceElement) {
      const height = invoiceElement.scrollHeight;
      const maxHeight = 800; // A4 height minus margins (297mm - 30mm = ~800px)
      return height <= maxHeight;
    }
    return true; // Default to true if element not found
  };
  const { t, language } = useLanguage();
  const [isCompactMode, setIsCompactMode] = useState(data.settings.compactMode ?? false);
  
  // Monitor content height and apply compact mode if needed
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        const fits = checkSinglePageFit();
        // Only auto-enable compact mode if content doesn't fit AND user hasn't manually set it
        if (!fits && !data.settings.compactMode) {
          const shouldBeCompact = true;
          setIsCompactMode(shouldBeCompact);
        } else {
          // Use manual setting or default to false
          setIsCompactMode(data.settings.compactMode ?? false);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, data]);

  // Update compact mode when settings change
  useEffect(() => {
    setIsCompactMode(data.settings.compactMode ?? false);
  }, [data.settings.compactMode]);
  
  // Calculate totals
  const subtotal = data.lineItems ? data.lineItems.reduce((total, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    return total + (quantity * unitPrice);
  }, 0) : parseFloat(data.price) || 0;

  // Calculate tax amount
  let taxAmount = 0;
  if (data.useOverallTax && data.overallTax) {
    const overallTaxRate = parseFloat(data.overallTax) || 0;
    taxAmount = (subtotal * overallTaxRate) / 100;
  } else if (data.lineItems) {
    taxAmount = data.lineItems.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const itemPrice = quantity * unitPrice;
      const itemTax = parseFloat(item.tax || '0') || 0;
      const itemTaxAmount = (itemPrice * itemTax) / 100;
      return total + itemTaxAmount;
    }, 0);
  } else {
    const taxRate = parseFloat(data.tax) || 0;
    taxAmount = (subtotal * taxRate) / 100;
  }

  const total = subtotal + taxAmount;

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      MAD: 'MAD'
    };
    return symbols[currency] || '$';
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toFixed(2)}`;
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  const getThemeStyles = () => {
    const baseStyles = {
      professional: {
        header: 'border-b-2 border-blue-600',
        accent: 'text-blue-600',
        bg: 'bg-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700',
        title: 'text-3xl font-bold text-gray-800',
        subtitle: 'text-gray-600',
        section: 'bg-gray-50',
        border: 'border-blue-200'
      },
      modern: {
        header: 'border-b-2 border-gray-800',
        accent: 'text-gray-800',
        bg: 'bg-gray-50',
        button: 'bg-gray-800 hover:bg-gray-900',
        title: 'text-3xl font-bold text-gray-900',
        subtitle: 'text-gray-700',
        section: 'bg-white',
        border: 'border-gray-300'
      },
      minimal: {
        header: 'border-b border-gray-300',
        accent: 'text-gray-700',
        bg: 'bg-white',
        button: 'bg-gray-700 hover:bg-gray-800',
        title: 'text-2xl font-semibold text-gray-800',
        subtitle: 'text-gray-600',
        section: 'bg-gray-50',
        border: 'border-gray-200'
      },
      colorful: {
        header: 'border-b-2 border-purple-500',
        accent: 'text-purple-600',
        bg: 'bg-purple-50',
        button: 'bg-purple-600 hover:bg-purple-700',
        title: 'text-3xl font-bold text-purple-800',
        subtitle: 'text-purple-700',
        section: 'bg-purple-50',
        border: 'border-purple-200'
      }
    };
    return baseStyles[data.settings.theme];
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with toggle */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 print:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleVisibility}
            className="flex items-center gap-3 text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors group"
          >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            {data.settings.documentType === 'FACTURE' ? t('facture') : t('devis')} Preview
            <span className="text-sm font-normal text-gray-500 group-hover:text-blue-500">
              ({isVisible ? 'Hide' : 'Show'})
            </span>
          </button>
          

        </div>
      </div>

      {/* Invoice Content */}
      {isVisible && (
        <div>
          <div id="invoice-content" className="invoice-content p-6 bg-white print:p-0 print:bg-white">
            {/* A4 Container */}
            <div className="max-w-[210mm] mx-auto bg-white print:max-w-none print:mx-0">
              <div className={`p-6 print:p-4 ${isCompactMode ? 'compact-mode' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {/* Header - will be repeated on each page */}
                <div className={`${themeStyles.header} pb-3 mb-4`}>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {data.settings.companyLogo && (
                    <img 
                      src={data.settings.companyLogo} 
                                              alt={t('companyLogoAlt')} 
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <h1 className={themeStyles.title}>{data.settings.documentType === 'FACTURE' ? t('facture') : t('devis')}</h1>
                    <p className={themeStyles.subtitle}>{t('invoiceNumber')}{data.invoiceNumber}</p>
                  </div>
                </div>
                <div className="text-right text-gray-600">
                  <p className="text-sm">{t('invoiceDate')}</p>
                  <p className="font-semibold">{formatDate(data.invoiceDate)}</p>
                </div>
              </div>
            </div>

            {/* Company and Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('from')}</h3>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700">{data.companyInfo.name}</p>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{data.companyInfo.address}</p>
                  <p className="text-gray-600 text-sm">{data.companyInfo.phone}</p>
                  <p className="text-gray-600 text-sm">{data.companyInfo.email}</p>
                  <p className="text-gray-600 text-sm">{data.companyInfo.website}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('billTo')}</h3>
                <p className="text-gray-700 font-medium text-lg">{capitalizeWords(data.clientName)}</p>
              </div>
            </div>

            {/* Due Date - Compact */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{t('dueDateLabel')}</span>
                <span className="font-semibold text-gray-800">{formatDate(data.dueDate)}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-4">
              <div className={`${themeStyles.section} rounded-lg p-3`}>
                <h3 className="text-base font-semibold text-gray-800 mb-2">{t('items')}</h3>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                    <div className="grid grid-cols-5 gap-3 text-xs font-semibold text-gray-700">
                      <div className="text-center">{t('qty')}</div>
                      <div>{t('designation')}</div>
                      <div className="text-center">{t('vat')}</div>
                      <div className="text-right">{t('unitPriceHT')}</div>
                      <div className="text-right">{t('totalHT')}</div>
                    </div>
                  </div>
                  
                  {data.lineItems && data.lineItems.map((item, index) => {
                    const quantity = parseFloat(item.quantity) || 0;
                    const unitPrice = parseFloat(item.unitPrice) || 0;
                    const itemPrice = quantity * unitPrice;
                    const itemTax = parseFloat(item.tax || '0') || 0;
                    const itemTaxAmount = (itemPrice * itemTax) / 100;
                    const itemTotal = itemPrice + itemTaxAmount;
                    
                    return (
                      <div key={index} className="line-item px-3 py-2 border-b border-gray-200 last:border-b-0">
                        <div className="grid grid-cols-5 gap-3 text-xs text-gray-700">
                          <div className="text-center">{quantity}</div>
                          <div className="font-medium">{item.description}</div>
                          <div className="text-center">{itemTax}%</div>
                          <div className="text-right">
                            {formatCurrency(unitPrice, data.settings.currency)}
                          </div>
                          <div className="text-right font-semibold">
                            {formatCurrency(itemTotal, data.settings.currency)}
                          </div>
                        </div>
                        {itemTax > 0 && (
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            Subtotal: {formatCurrency(itemPrice, data.settings.currency)} + Tax ({itemTax}%): {formatCurrency(itemTaxAmount, data.settings.currency)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Totals */}
                  <div className="totals-section bg-gray-50 px-3 py-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-700">
                        <span>{t('totalHTLabel')}</span>
                        <span className="font-medium">
                          {formatCurrency(subtotal, data.settings.currency)}
                        </span>
                      </div>
                      
                      {/* VAT */}
                      {taxAmount > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>{t('vatLabel')}</span>
                          <span className="font-medium">
                            {formatCurrency(taxAmount, data.settings.currency)}
                          </span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-300 pt-1">
                        <div className="flex justify-between text-base font-bold text-gray-800">
                          <span>{t('totalTTCLabel')}</span>
                          <span className={themeStyles.accent}>
                            {formatCurrency(total, data.settings.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            {(data.validityPeriod?.trim() || data.paymentDetails?.trim()) && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="space-y-3 text-xs">
                  {data.validityPeriod?.trim() && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{t('validityHeader')}</h4>
                      <p className="text-gray-600">{data.validityPeriod}</p>
                    </div>
                  )}
                  {data.paymentDetails?.trim() && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{t('paymentTermsHeader')}</h4>
                      <p className="text-gray-600">{data.paymentDetails}</p>
                    </div>
                  )}
                </div>
                <div className="text-center text-gray-500 text-xs mt-4">
                  <p>{data.settings.customFooter}</p>
                </div>
              </div>
            )}
            

              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 print:hidden">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button
                onClick={onDownloadPDF}
                disabled={isGeneratingPDF}
                className={`flex-1 text-white px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${themeStyles.button}`}
              >
                <Download size={20} />
                {isGeneratingPDF ? t('generating') : t('downloadPDF')}
              </button>
            </div>
            
            {/* WhatsApp Message Editor */}
            <WhatsAppMessageEditor
              data={{
                clientName: data.clientName,
                serviceDescription: data.serviceDescription,
                totalAmount: total,
                dueDate: data.dueDate,
                currency: data.settings.currency,
                lineItems: data.lineItems,
                language: language,
                advancePercentage: data.advancePercentage,
                advanceAmount: data.advanceAmount,
                advanceType: data.advanceType,
                deliveryPercentage: data.deliveryPercentage,
                deliveryAmount: data.deliveryAmount,
                deliveryType: data.deliveryType,
                includeDelivery: data.includeDelivery
              }}
              onSendMessage={onSendWhatsApp}
              pdfBlob={pdfBlob}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;