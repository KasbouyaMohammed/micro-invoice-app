import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Hash } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  tax?: string;
}

interface FormData {
  clientName: string;
  serviceDescription: string;
  price: string;
  tax: string;
  dueDate: string;
  lineItems: LineItem[];
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

interface FormErrors {
  clientName?: string;
  serviceDescription?: string;
  price?: string;
  dueDate?: string;
  lineItems?: string;
  customInvoiceNumber?: string;
  manualTotal?: string;
  overallTax?: string;
}

interface InvoiceFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
  currentSettings?: {
    theme: 'professional' | 'modern' | 'minimal' | 'colorful';
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'MAD';
    showLogo: boolean;
    customFooter: string;
  };
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit, initialData, currentSettings }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    serviceDescription: '',
    price: '',
    tax: '0',
    dueDate: '',
    lineItems: [{ id: '1', description: '', quantity: '1', unitPrice: '', tax: '0' }],
    currency: currentSettings?.currency || 'USD',
    customInvoiceNumber: '',
    manualTotal: '',
    useManualTotal: false,
    useOverallTax: false,
    overallTax: '0',
    validityPeriod: '',
    validityMonths: '',
    paymentDetails: '',
    advancePercentage: '',
    advanceAmount: '',
    advanceType: 'percentage',
    deliveryPercentage: '',
    deliveryAmount: '',
    deliveryType: 'percentage',
    includeDelivery: false,
    ...initialData
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<string>('');

  const [useCustomInvoiceNumber, setUseCustomInvoiceNumber] = useState(false);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('invoiceFormData');
    const savedTimestamp = localStorage.getItem('invoiceFormDataTimestamp');
    
    if (savedData && !initialData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        if (savedTimestamp) {
          setLastSaved(new Date(parseInt(savedTimestamp)).toLocaleString());
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [initialData]);

  // Regenerate payment details when language changes
  useEffect(() => {
    if (formData.advancePercentage || formData.advanceAmount) {
      const paymentDetails = formatPaymentDetails(
        formData,
        formData.advancePercentage || '',
        formData.advanceAmount || '',
        formData.advanceType || 'percentage'
      );
      setFormData(prev => ({ ...prev, paymentDetails }));
    }
  }, [t]); // Dependency on translation function

  // Regenerate validity period when language changes
  useEffect(() => {
    if (formData.validityMonths) {
      setFormData(prev => ({
        ...prev,
        validityPeriod: `${formData.validityMonths} ${t('validityMonths')}`
      }));
    }
  }, [t, formData.validityMonths]);

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      setSaveStatus('saving');
      
      try {
        localStorage.setItem('invoiceFormData', JSON.stringify(formData));
        localStorage.setItem('invoiceFormDataTimestamp', Date.now().toString());
        setLastSaved(new Date().toLocaleString());
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error saving form data:', error);
        setSaveStatus('unsaved');
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(saveTimeout);
  }, [formData]);

  // Update form currency when settings change
  useEffect(() => {
    if (currentSettings?.currency && currentSettings.currency !== formData.currency) {
      setFormData(prev => ({ ...prev, currency: currentSettings.currency }));
    }
  }, [currentSettings?.currency]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleValidityMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setFormData(prev => ({ 
      ...prev, 
      validityMonths: numericValue,
      validityPeriod: numericValue ? `${numericValue} ${t('validityMonths')}` : ''
    }));
  };

  const handleAdvancePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    const totalAmount = calculateTotal();
    
    setFormData(prev => {
      let advanceAmount = '';
      let paymentDetails = '';
      
      if (numericValue && totalAmount > 0) {
        const percentage = parseFloat(numericValue);
        advanceAmount = ((percentage / 100) * totalAmount).toFixed(2);
        const updatedData = { ...prev, advancePercentage: numericValue, advanceAmount };
        paymentDetails = formatPaymentDetails(updatedData, numericValue, advanceAmount, 'percentage');
      }
      
      return {
        ...prev,
        advancePercentage: numericValue,
        advanceAmount,
        paymentDetails
      };
    });
  };

  const handleAdvanceAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    const totalAmount = calculateTotal();
    
    setFormData(prev => {
      let advancePercentage = '';
      let paymentDetails = '';
      
      if (numericValue && totalAmount > 0) {
        const amount = parseFloat(numericValue);
        advancePercentage = ((amount / totalAmount) * 100).toFixed(1);
        const updatedData = { ...prev, advancePercentage, advanceAmount: numericValue };
        paymentDetails = formatPaymentDetails(updatedData, advancePercentage, numericValue, 'amount');
      }
      
      return {
        ...prev,
        advancePercentage,
        advanceAmount: numericValue,
        paymentDetails
      };
    });
  };

  const handleDeliveryPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    const totalAmount = calculateTotal();
    
    setFormData(prev => {
      let deliveryAmount = '';
      let paymentDetails = '';
      
      if (numericValue && totalAmount > 0) {
        const percentage = parseFloat(numericValue);
        deliveryAmount = ((percentage / 100) * totalAmount).toFixed(2);
        const updatedData = { ...prev, deliveryPercentage: numericValue, deliveryAmount };
        paymentDetails = formatPaymentDetails(updatedData, prev.advancePercentage || '', prev.advanceAmount || '', prev.advanceType || 'percentage');
      }
      
      return {
        ...prev,
        deliveryPercentage: numericValue,
        deliveryAmount,
        paymentDetails
      };
    });
  };

  const handleDeliveryAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    const totalAmount = calculateTotal();
    
    setFormData(prev => {
      let deliveryPercentage = '';
      let paymentDetails = '';
      
      if (numericValue && totalAmount > 0) {
        const amount = parseFloat(numericValue);
        deliveryPercentage = ((amount / totalAmount) * 100).toFixed(1);
        const updatedData = { ...prev, deliveryPercentage, deliveryAmount: numericValue };
        paymentDetails = formatPaymentDetails(updatedData, prev.advancePercentage || '', prev.advanceAmount || '', prev.advanceType || 'percentage');
      }
      
      return {
        ...prev,
        deliveryPercentage,
        deliveryAmount: numericValue,
        paymentDetails
      };
    });
  };

  const formatPaymentDetails = (prev: FormData, advanceValue: string, advanceAmount: string, advanceType: 'percentage' | 'amount') => {
    if (!advanceValue) return '';
    
    const total = calculateTotal();
    
    // Format advance payment
    let advanceText = '';
    let advanceAmountValue = 0;
    if (advanceType === 'percentage') {
      advanceAmountValue = (parseFloat(advanceValue) * total) / 100;
      advanceText = `${advanceValue}% ${t('advancePercentage')} (${formatCurrency(advanceAmountValue, prev.currency)})`;
    } else {
      advanceAmountValue = parseFloat(advanceAmount);
      const advancePercentage = (advanceAmountValue / total) * 100;
      advanceText = `${advancePercentage.toFixed(1)}% ${t('advancePercentage')} (${formatCurrency(advanceAmountValue, prev.currency)})`;
    }
    
    // If delivery payment is included and specified
    if (prev.includeDelivery && prev.deliveryPercentage && prev.deliveryAmount) {
      let deliveryText = '';
      if (prev.deliveryType === 'percentage') {
        const deliveryAmount = (parseFloat(prev.deliveryPercentage) * total) / 100;
        deliveryText = `${prev.deliveryPercentage}% ${t('deliveryPercentage')} (${formatCurrency(deliveryAmount, prev.currency)})`;
      } else {
        const deliveryAmount = parseFloat(prev.deliveryAmount);
        const deliveryPercentage = (deliveryAmount / total) * 100;
        deliveryText = `${deliveryPercentage.toFixed(1)}% ${t('deliveryPercentage')} (${formatCurrency(deliveryAmount, prev.currency)})`;
      }
      return `${advanceText}, ${deliveryText}`;
    }
    
    // If delivery payment is not included, only show advance payment
    if (!prev.includeDelivery) {
      return advanceText;
    }
    
    // If delivery payment is included but not specified, show the remaining amount
    const remainingAmount = total - advanceAmountValue;
    const remainingPercentage = (remainingAmount / total) * 100;
    const remainingText = `${remainingPercentage.toFixed(1)}% ${t('deliveryPercentage')} (${formatCurrency(remainingAmount, prev.currency)})`;
    
    return `${advanceText}, ${remainingText}`;
  };



  const handleLineItemChange = (id: string, field: keyof LineItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addLineItem = () => {
    const newId = (Math.max(...formData.lineItems.map(item => parseInt(item.id))) + 1).toString();
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: newId, description: '', quantity: '1', unitPrice: '', tax: '0' }]
    }));
    
    // Smooth scroll to the newly added item after a brief delay
    setTimeout(() => {
      const newItemElement = document.querySelector(`[data-item-id="${newId}"]`);
      if (newItemElement) {
        newItemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const removeLineItem = (id: string) => {
    if (formData.lineItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter(item => item.id !== id)
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.lineItems.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const price = quantity * unitPrice;
      return total + price;
    }, 0);
  };

  const calculateIndividualTaxes = () => {
    return formData.lineItems.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const price = quantity * unitPrice;
      const tax = parseFloat(item.tax || '0') || 0;
      const taxAmount = (price * tax) / 100;
      return total + taxAmount;
    }, 0);
  };

  const calculateOverallTax = () => {
    const subtotal = calculateSubtotal();
    const overallTaxRate = parseFloat(formData.overallTax || '0') || 0;
    return (subtotal * overallTaxRate) / 100;
  };

  const calculateTotal = () => {
    if (formData.useManualTotal && formData.manualTotal) {
      return parseFloat(formData.manualTotal) || 0;
    }
    
    const subtotal = calculateSubtotal();
    
    if (formData.useOverallTax) {
      const overallTax = calculateOverallTax();
      return subtotal + overallTax;
    } else {
      const individualTaxes = calculateIndividualTaxes();
      return subtotal + individualTaxes;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = t('clientNameRequired');
    }

    if (!formData.dueDate) {
      newErrors.dueDate = t('dueDateRequired');
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = t('dueDatePast');
      }
    }

    if (useCustomInvoiceNumber && !formData.customInvoiceNumber?.trim()) {
      newErrors.customInvoiceNumber = t('customInvoiceNumberRequired');
    }

    if (formData.useManualTotal && (!formData.manualTotal || parseFloat(formData.manualTotal) < 0.01)) {
      newErrors.manualTotal = t('manualTotalMinimum');
    }

    if (formData.useOverallTax && (!formData.overallTax || parseFloat(formData.overallTax) < 0)) {
      newErrors.overallTax = t('overallTaxRequired');
    }

    const hasValidLineItems = formData.lineItems.some(item => 
      item.description.trim() && parseFloat(item.quantity) > 0 && parseFloat(item.unitPrice) > 0
    );
    if (!hasValidLineItems) {
      newErrors.lineItems = t('lineItemsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Calculate total from line items if using them
    const total = calculateTotal();
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      price: total.toString(),
      serviceDescription: formData.serviceDescription
    };
    
    // Simulate brief loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onSubmit(submissionData);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      serviceDescription: '',
      price: '',
      tax: '0',
      dueDate: '',
      lineItems: [{ id: '1', description: '', quantity: '1', unitPrice: '', tax: '0' }],
      currency: currentSettings?.currency || 'USD',
      customInvoiceNumber: '',
      manualTotal: '',
      useManualTotal: false,
      useOverallTax: false,
      overallTax: '0',
      validityPeriod: '',
      validityMonths: '',
      paymentDetails: '',
      advancePercentage: '',
      advanceAmount: '',
      advanceType: 'percentage',
      deliveryPercentage: '',
      deliveryAmount: '',
      deliveryType: 'percentage',
      includeDelivery: false,
    });
    setErrors({});
    setUseCustomInvoiceNumber(false);
    setSaveStatus('saved');
    setLastSaved('');
    localStorage.removeItem('invoiceFormData');
    localStorage.removeItem('invoiceFormDataTimestamp');
  };

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



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('basicInformation')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Name */}
          <div className="space-y-2">
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
              {t('clientName')}
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.clientName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
                              placeholder={t('clientNamePlaceholder')}
            />
            {errors.clientName && (
              <p className="text-sm text-red-600">{errors.clientName}</p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              {t('dueDate')}
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dueDate ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-600">{errors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Custom Invoice Number */}
        <div className="mt-6">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomInvoiceNumber}
                onChange={(e) => setUseCustomInvoiceNumber(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">{t('useCustomInvoiceNumber')}</span>
            </label>
            <span className="text-xs text-gray-500">{t('optional')}</span>
          </div>
          
          {useCustomInvoiceNumber && (
            <div className="mt-4 space-y-2">
              <label htmlFor="customInvoiceNumber" className="block text-sm font-medium text-gray-700">
                {t('customInvoiceNumber')}
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  id="customInvoiceNumber"
                  name="customInvoiceNumber"
                  value={formData.customInvoiceNumber}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customInvoiceNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder={t('customInvoiceNumberPlaceholder')}
                />
              </div>
              {errors.customInvoiceNumber && (
                <p className="text-sm text-red-600">{errors.customInvoiceNumber}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Currency Selection */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('invoiceSettings')}</h3>
        
        <div className="space-y-2">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            {t('currency')}
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="MAD">MAD</option>
          </select>
        </div>
      </div>

            {/* Line Items Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{t('lineItems')}</h3>
          </div>
          
          {formData.lineItems.map((item) => (
            <div key={item.id} data-item-id={item.id} className="grid grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg mb-4">
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('description')}
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('itemDescriptionPlaceholder')}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('quantity')}
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('quantityPlaceholder')}
                />
              </div>
              
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('unitPrice')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleLineItemChange(item.id, 'unitPrice', e.target.value)}
                    min="0.01"
                    step="0.01"
                    className="w-full px-3 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('unitPricePlaceholder')}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tax')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={item.tax || '0'}
                    onChange={(e) => handleLineItemChange(item.id, 'tax', e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('taxPlaceholder')}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              
              <div className="col-span-1 flex items-end">
                {formData.lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('removeItem')}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add Item Button - Now at the bottom */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus size={16} />
              {t('addItem')}
            </button>
          </div>
          
          {errors.lineItems && (
            <p className="text-sm text-red-600">{errors.lineItems}</p>
          )}

          {/* Overall Tax Option */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.useOverallTax}
                  onChange={(e) => setFormData(prev => ({ ...prev, useOverallTax: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{t('applyOverallTax')}</span>
              </label>
            </div>
            
            {formData.useOverallTax && (
              <div className="space-y-2">
                <label htmlFor="overallTax" className="block text-sm font-medium text-gray-700">
                  {t('overallTaxRate')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="overallTax"
                    name="overallTax"
                    value={formData.overallTax}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className={`w-full px-4 py-3 pr-8 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.overallTax ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={t('overallTaxPlaceholder')}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                {errors.overallTax && (
                  <p className="text-sm text-red-600">{errors.overallTax}</p>
                )}
              </div>
            )}
          </div>

          {/* Manual Total Option */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.useManualTotal}
                  onChange={(e) => setFormData(prev => ({ ...prev, useManualTotal: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{t('enterTotalManually')}</span>
              </label>
            </div>
            
            {formData.useManualTotal && (
              <div className="space-y-2">
                <label htmlFor="manualTotal" className="block text-sm font-medium text-gray-700">
                  {t('manualTotal')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="manualTotal"
                    name="manualTotal"
                    value={formData.manualTotal}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    className={`w-full px-4 pr-12 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.manualTotal ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={t('manualTotalPlaceholder')}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                </div>
                {errors.manualTotal && (
                  <p className="text-sm text-red-600">{errors.manualTotal}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Total Preview */}
          {!formData.useManualTotal && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{t('subtotal')}</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(calculateSubtotal(), formData.currency)}
                  </span>
                </div>
                {formData.useOverallTax && parseFloat(formData.overallTax || '0') > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t('overallTax')} ({formData.overallTax}%):</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(calculateOverallTax(), formData.currency)}
                    </span>
                  </div>
                )}
                {!formData.useOverallTax && calculateIndividualTaxes() > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t('totalIndividualTaxes')}</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(calculateIndividualTaxes(), formData.currency)}
                    </span>
                  </div>
                )}
                <div className="border-t border-blue-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">{t('total')}</span>
                    <span className="font-bold text-blue-800">
                      {formatCurrency(calculateTotal(), formData.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Settings */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('validity')}</h3>
          
          <div className="space-y-6">
            {/* Validity Period */}
            <div className="flex flex-col">
              <label htmlFor="validityMonths" className="block text-sm font-medium text-gray-700 mb-2">
                {t('validityPeriod')}
              </label>
              <input
                type="number"
                id="validityMonths"
                name="validityMonths"
                value={formData.validityMonths}
                onChange={handleValidityMonthsChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                placeholder={t('validityMonthsPlaceholder')}
                min="0"
              />
              {formData.validityPeriod && (
                <p className="text-sm text-gray-500 mt-1">{formData.validityPeriod}</p>
              )}
            </div>

            {/* Payment Terms */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800">{t('paymentTermsTitle')}</h4>
              
              {/* Advance Payment */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">{t('advancePayment')}</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="advanceType"
                        value="percentage"
                        checked={formData.advanceType === 'percentage'}
                        onChange={(e) => setFormData(prev => ({ ...prev, advanceType: e.target.value as 'percentage' | 'amount' }))}
                        className="text-blue-600"
                      />
                      <span className="text-sm">{t('percentage')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="advanceType"
                        value="amount"
                        checked={formData.advanceType === 'amount'}
                        onChange={(e) => setFormData(prev => ({ ...prev, advanceType: e.target.value as 'percentage' | 'amount' }))}
                        className="text-blue-600"
                      />
                      <span className="text-sm">{t('amount')}</span>
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="advancePercentage" className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.advanceType === 'percentage' ? `${t('advancePercentage')} %` : t('advanceAmount')}
                    </label>
                    <input
                      type="number"
                      id="advancePercentage"
                      name="advancePercentage"
                      value={formData.advanceType === 'percentage' ? formData.advancePercentage : formData.advanceAmount}
                      onChange={formData.advanceType === 'percentage' ? handleAdvancePercentageChange : handleAdvanceAmountChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                      placeholder={formData.advanceType === 'percentage' ? t('advancePercentagePlaceholder') : t('advanceAmountPlaceholder')}
                      min="0"
                      max={formData.advanceType === 'percentage' ? "100" : undefined}
                      step={formData.advanceType === 'percentage' ? "0.1" : "0.01"}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Payment */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.includeDelivery}
                      onChange={(e) => {
                        const newIncludeDelivery = e.target.checked;
                        setFormData(prev => {
                          const updatedData = { ...prev, includeDelivery: newIncludeDelivery };
                          // Regenerate payment details based on new checkbox state
                          let paymentDetails = '';
                          if (prev.advancePercentage || prev.advanceAmount) {
                            paymentDetails = formatPaymentDetails(
                              updatedData, 
                              prev.advancePercentage || '', 
                              prev.advanceAmount || '', 
                              prev.advanceType || 'percentage'
                            );
                          }
                          return { ...updatedData, paymentDetails };
                        });
                      }}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">{t('includeDelivery')}</span>
                  </label>
                </div>
                
                {formData.includeDelivery && (
                  <>
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700">{t('deliveryPayment')}</label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="deliveryType"
                            value="percentage"
                            checked={formData.deliveryType === 'percentage'}
                            onChange={(e) => {
                              setFormData(prev => {
                                const updatedData = { ...prev, deliveryType: e.target.value as 'percentage' | 'amount' };
                                // Regenerate payment details
                                let paymentDetails = '';
                                if (prev.advancePercentage || prev.advanceAmount) {
                                  paymentDetails = formatPaymentDetails(
                                    updatedData, 
                                    prev.advancePercentage || '', 
                                    prev.advanceAmount || '', 
                                    prev.advanceType || 'percentage'
                                  );
                                }
                                return { ...updatedData, paymentDetails };
                              });
                            }}
                            className="text-blue-600"
                          />
                          <span className="text-sm">{t('percentage')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="deliveryType"
                            value="amount"
                            checked={formData.deliveryType === 'amount'}
                            onChange={(e) => {
                              setFormData(prev => {
                                const updatedData = { ...prev, deliveryType: e.target.value as 'percentage' | 'amount' };
                                // Regenerate payment details
                                let paymentDetails = '';
                                if (prev.advancePercentage || prev.advanceAmount) {
                                  paymentDetails = formatPaymentDetails(
                                    updatedData, 
                                    prev.advancePercentage || '', 
                                    prev.advanceAmount || '', 
                                    prev.advanceType || 'percentage'
                                  );
                                }
                                return { ...updatedData, paymentDetails };
                              });
                            }}
                            className="text-blue-600"
                          />
                          <span className="text-sm">{t('amount')}</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label htmlFor="deliveryPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                          {formData.deliveryType === 'percentage' ? `${t('deliveryPercentage')} %` : t('deliveryAmount')}
              </label>
              <input
                          type="number"
                          id="deliveryPercentage"
                          name="deliveryPercentage"
                          value={formData.deliveryType === 'percentage' ? formData.deliveryPercentage : formData.deliveryAmount}
                          onChange={formData.deliveryType === 'percentage' ? handleDeliveryPercentageChange : handleDeliveryAmountChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                          placeholder={formData.deliveryType === 'percentage' ? t('deliveryPercentagePlaceholder') : t('deliveryAmountPlaceholder')}
                          min="0"
                          max={formData.deliveryType === 'percentage' ? "100" : undefined}
                          step={formData.deliveryType === 'percentage' ? "0.1" : "0.01"}
              />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              {t('paymentTip')}
            </p>
            {formData.paymentDetails && (
              <p className="text-sm text-gray-700 font-medium">{formData.paymentDetails}</p>
            )}
          </div>
        </div>

      {/* Save Status */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            saveStatus === 'saved' ? 'bg-green-500' : 
            saveStatus === 'saving' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600">
            {saveStatus === 'saved' ? t('saved') : 
             saveStatus === 'saving' ? t('saving') : t('unsaved')}
          </span>
        </div>
        {lastSaved && (
          <span className="text-xs text-gray-500">
            {t('lastSaved')}: {lastSaved}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FileText size={20} />
          {isSubmitting ? t('generating') : t('generateInvoice')}
        </button>
        
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          {t('clearInvoice')}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;