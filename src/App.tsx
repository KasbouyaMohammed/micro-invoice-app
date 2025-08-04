import { useState, useEffect } from 'react';
import { FileText, AlertCircle, Settings, Palette, Building2 } from 'lucide-react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import CompanyInfoEditor from './components/CompanyInfoEditor';
import LanguageSelector from './components/LanguageSelector';
import { generatePDF, generatePDFAndDownload, createPDFFilename } from './utils/pdfGenerator';
import { createWhatsAppMessage, openWhatsApp } from './utils/whatsappShare';
import { useLanguage } from './contexts/LanguageContext';

interface FormData {
  clientName: string;
  serviceDescription: string;
  price: string;
  tax: string;
  dueDate: string;
  lineItems?: Array<{ description: string; quantity: string; unitPrice: string; tax?: string }>;
  currency: string;
  customInvoiceNumber?: string;
  manualTotal?: string;
  useManualTotal?: boolean;
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

interface InvoiceData extends FormData {
  invoiceNumber: string;
  invoiceDate: string;
  companyInfo: CompanyInfo;
  settings: InvoiceSettings;
  lineItems: Array<{ description: string; quantity: string; unitPrice: string; tax?: string }>;
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

function App() {
  const { t, language } = useLanguage();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(true);
  const [showCompanyEditor, setShowCompanyEditor] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | undefined>(undefined);
  const [currentSettings, setCurrentSettings] = useState<InvoiceSettings>(() => {
    const savedSettings = localStorage.getItem('invoiceSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
    return {
      theme: 'professional',
      currency: 'USD',
      showLogo: false,
      customFooter: t('defaultFooter'),
      documentType: 'FACTURE',
      companyLogo: undefined
    };
  });

  // Update footer text when language changes
  useEffect(() => {
    setCurrentSettings(prev => ({
      ...prev,
      customFooter: t('defaultFooter')
    }));
  }, [t]);

  // Default company info
  const defaultCompanyInfo: CompanyInfo = (() => {
    const savedCompanyInfo = localStorage.getItem('companyInfo');
    if (savedCompanyInfo) {
      try {
        return JSON.parse(savedCompanyInfo);
      } catch (error) {
        console.error('Error loading saved company info:', error);
      }
    }
    return {
      name: 'Your Company Name',
      address: '123 Business Street\nCity, State 12345',
      phone: '+1 (555) 123-4567',
      email: 'contact@yourcompany.com',
      website: 'www.yourcompany.com'
    };
  })();

  const generateInvoiceNumber = (customNumber?: string): string => {
    if (customNumber?.trim()) {
      return customNumber.trim();
    }
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
  };

  const handleFormSubmit = (formData: FormData) => {
    setError(null);
    
    const invoice: InvoiceData = {
      ...formData,
      invoiceNumber: generateInvoiceNumber(formData.customInvoiceNumber),
      invoiceDate: new Date().toISOString().split('T')[0],
      companyInfo: defaultCompanyInfo,
      settings: {
        ...currentSettings,
        currency: formData.currency as InvoiceSettings['currency'] || 'USD'
      },
      lineItems: formData.lineItems?.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tax: item.tax
      })) || []
    };
    
    setInvoiceData(invoice);
    setShowPreview(true);
    
    // Smooth scroll to preview
    setTimeout(() => {
      const previewElement = document.getElementById('invoice-preview');
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceData) return;

    setIsGeneratingPDF(true);
    setError(null);

    try {
      const filename = createPDFFilename(invoiceData.clientName);
      const blob = await generatePDF('invoice-content', { 
        filename, 
        clientName: invoiceData.clientName 
      });
      setPdfBlob(blob);
      
      // Also download the PDF
      await generatePDFAndDownload('invoice-content', { 
        filename, 
        clientName: invoiceData.clientName 
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      setError(t('errorGeneratingPDF'));
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!invoiceData) return;

    try {
      const subtotal = parseFloat(invoiceData.price) || 0;
      const taxRate = parseFloat(invoiceData.tax) || 0;
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount;

      const message = createWhatsAppMessage({
        clientName: invoiceData.clientName,
        serviceDescription: invoiceData.serviceDescription,
        totalAmount: total,
        dueDate: invoiceData.dueDate,
        currency: invoiceData.settings.currency,
        lineItems: invoiceData.lineItems,
        language: language
      });

      openWhatsApp(message);
    } catch (error) {
      console.error('WhatsApp sharing error:', error);
      setError(t('errorOpeningWhatsApp'));
    }
  };

  const handleNewInvoice = () => {
    setInvoiceData(null);
    setShowPreview(false);
    setError(null);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSettingsUpdate = (updatedSettings: Partial<InvoiceSettings>) => {
    const newSettings = { ...currentSettings, ...updatedSettings };
    setCurrentSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('invoiceSettings', JSON.stringify(newSettings));
    
    if (invoiceData) {
      setInvoiceData({
        ...invoiceData,
        settings: newSettings
      });
    }
  };

  const handleCompanyInfoUpdate = (updatedCompanyInfo: CompanyInfo) => {
    // Save to localStorage
    localStorage.setItem('companyInfo', JSON.stringify(updatedCompanyInfo));
    
    if (invoiceData) {
      setInvoiceData({
        ...invoiceData,
        companyInfo: updatedCompanyInfo
      });
    }
    setShowCompanyEditor(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const updatedSettings = { ...currentSettings, companyLogo: base64String };
        setCurrentSettings(updatedSettings);
        localStorage.setItem('invoiceSettings', JSON.stringify(updatedSettings));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    const updatedSettings = { ...currentSettings, companyLogo: undefined };
    setCurrentSettings(updatedSettings);
    localStorage.setItem('invoiceSettings', JSON.stringify(updatedSettings));
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 print:bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                <p className="text-gray-600">{t('appSubtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LanguageSelector />
              {invoiceData && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} />
                  <span className="hidden sm:inline">{t('customize')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:max-w-none print:px-0 print:py-0">
        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">{t('error')}</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-8 print:space-y-0">
          {/* Settings Panel */}
          {showSettings && (
            <section className="bg-white rounded-xl shadow-lg p-6 print:hidden">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">{t('customize')}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('invoiceSettings')}
                  </label>
                  <select
                    value={currentSettings.theme}
                    onChange={(e) => handleSettingsUpdate({ theme: e.target.value as InvoiceSettings['theme'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">{t('themeProfessional')}</option>
                    <option value="modern">{t('themeModern')}</option>
                    <option value="minimal">{t('themeMinimal')}</option>
                    <option value="colorful">{t('themeColorful')}</option>
                  </select>
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('currency')}
                  </label>
                  <select
                    value={currentSettings.currency}
                    onChange={(e) => handleSettingsUpdate({ currency: e.target.value as InvoiceSettings['currency'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="MAD">MAD</option>
                  </select>
                </div>

                {/* Document Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('documentType')}
                  </label>
                  <select
                    value={currentSettings.documentType}
                    onChange={(e) => handleSettingsUpdate({ documentType: e.target.value as InvoiceSettings['documentType'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FACTURE">{t('facture')}</option>
                    <option value="DEVIS">{t('devis')}</option>
                  </select>
                </div>

                {/* Company Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('companyLogo')}
                  </label>
                  <div className="space-y-3">
                    {currentSettings.companyLogo ? (
                      <div className="flex items-center gap-3">
                        <img 
                          src={currentSettings.companyLogo} 
                          alt={t('companyLogoAlt')} 
                          className="w-12 h-12 object-contain border border-gray-200 rounded"
                        />
                        <button
                          onClick={handleLogoRemove}
                          className="px-3 py-1 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
                        >
                          {t('removeLogo')}
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {t('uploadLogo')}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Info Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">{t('from')}</h3>
                  </div>
                  <button
                    onClick={() => setShowCompanyEditor(!showCompanyEditor)}
                    className="px-3 py-1 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    {showCompanyEditor ? t('cancel') : t('edit')}
                  </button>
                </div>
                
                {!showCompanyEditor ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">{t('company')}</span>
                      <p className="text-gray-600">{defaultCompanyInfo.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('address')}</span>
                      <p className="text-gray-600 whitespace-pre-line">{defaultCompanyInfo.address}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('phone')}</span>
                      <p className="text-gray-600">{defaultCompanyInfo.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('email')}</span>
                      <p className="text-gray-600">{defaultCompanyInfo.email}</p>
                    </div>
                  </div>
                ) : (
                  <CompanyInfoEditor
                    companyInfo={defaultCompanyInfo}
                    onSave={handleCompanyInfoUpdate}
                    onCancel={() => setShowCompanyEditor(false)}
                  />
                )}
              </div>
            </section>
          )}

          {/* Invoice Form */}
          <section className="bg-white rounded-xl shadow-lg p-8 print:hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {invoiceData ? t('editInvoiceDetails') : t('createNewInvoice')}
              </h2>
              {invoiceData && (
                <button
                  onClick={handleNewInvoice}
                  className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {t('newInvoice')}
                </button>
              )}
            </div>
            
            <InvoiceForm 
              onSubmit={handleFormSubmit}
              initialData={invoiceData ? {
                clientName: invoiceData.clientName,
                serviceDescription: invoiceData.serviceDescription,
                price: invoiceData.price,
                tax: invoiceData.tax,
                dueDate: invoiceData.dueDate,
                lineItems: invoiceData.lineItems.map((item, index) => ({
                  id: (index + 1).toString(),
                  description: item.description,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  tax: item.tax
                })),
                currency: invoiceData.settings.currency,
                customInvoiceNumber: invoiceData.customInvoiceNumber,
                manualTotal: invoiceData.manualTotal,
                useManualTotal: invoiceData.useManualTotal
              } : undefined}
              currentSettings={invoiceData?.settings || currentSettings}
            />
          </section>

          {/* Invoice Preview */}
          {invoiceData && (
            <section id="invoice-preview">
                          <InvoicePreview
              data={invoiceData}
              onDownloadPDF={handleDownloadPDF}
              onSendWhatsApp={handleSendWhatsApp}
              isVisible={showPreview}
              onToggleVisibility={() => setShowPreview(!showPreview)}
              isGeneratingPDF={isGeneratingPDF}
              pdfBlob={pdfBlob}
            />
            </section>
          )}

          {/* Features */}
          {!invoiceData && (
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('features')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('professionalInvoices')}</h3>
                  <p className="text-gray-600 text-sm">{t('professionalInvoicesDesc')}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('pdfDownload')}</h3>
                  <p className="text-gray-600 text-sm">{t('pdfDownloadDesc')}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('whatsappSharing')}</h3>
                  <p className="text-gray-600 text-sm">{t('whatsappSharingDesc')}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>{t('footerCopyright')}</p>
            <p className="mt-2 text-sm">{t('footerSubtitle')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;