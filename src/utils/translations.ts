export interface Translations {
  // App Header
  appTitle: string;
  appSubtitle: string;
  customize: string;
  
  // Form Labels
  basicInformation: string;
  clientName: string;
  dueDate: string;
  customInvoiceNumber: string;
  useCustomInvoiceNumber: string;
  optional: string;
  invoiceSettings: string;
  currency: string;
  useMultipleLineItems: string;
  lineItems: string;
  addItem: string;
  description: string;
  quantity: string;
  unitPrice: string;
  tax: string;
  applyOverallTax: string;
  overallTaxRate: string;
  enterTotalManually: string;
  manualTotal: string;
  subtotal: string;
  total: string;
  totalIndividualTaxes: string;
  overallTax: string;
  generateInvoice: string;
  generating: string;
  resetForm: string;
  
  // Placeholders
  clientNamePlaceholder: string;
  serviceDescriptionPlaceholder: string;
  itemDescriptionPlaceholder: string;
  quantityPlaceholder: string;
  unitPricePlaceholder: string;
  taxPlaceholder: string;
  customInvoiceNumberPlaceholder: string;
  manualTotalPlaceholder: string;
  overallTaxPlaceholder: string;
  validityMonthsPlaceholder: string;
  advancePercentagePlaceholder: string;
  advanceAmountPlaceholder: string;
  deliveryPercentagePlaceholder: string;
  deliveryAmountPlaceholder: string;
  
  // Invoice Content
  invoice: string;
  invoiceNumber: string;
  invoiceDate: string;
  from: string;
  billTo: string;
  items: string;
  qty: string;
  designation: string;
  vat: string;
  unitPriceHT: string;
  totalHT: string;
  dueDateLabel: string;
  
  // Actions
  downloadPDF: string;
  sendViaWhatsApp: string;
  newInvoice: string;
  editInvoiceDetails: string;
  createNewInvoice: string;
  
  // Features
  features: string;
  professionalInvoices: string;
  professionalInvoicesDesc: string;
  pdfDownload: string;
  pdfDownloadDesc: string;
  whatsappSharing: string;
  whatsappSharingDesc: string;
  
  // Footer
  footerCopyright: string;
  footerSubtitle: string;
  
  // Error Messages
  clientNameRequired: string;
  dueDateRequired: string;
  dueDatePast: string;
  customInvoiceNumberRequired: string;
  manualTotalRequired: string;
  manualTotalMinimum: string;
  overallTaxRequired: string;
  lineItemsRequired: string;
  serviceDescriptionRequired: string;
  priceRequired: string;
  priceMinimum: string;
  
  // WhatsApp Messages
  invoiceFor: string;
  whatsappItems: string;
  whatsappTotal: string;
  due: string;
  thankYou: string;
  service: string;
  
  // WhatsApp Editor
  whatsappMessagePreview: string;
  whatsappMessage: string;
  whatsappMessagePlaceholder: string;
  customMessage: string;
  customMessagePlaceholder: string;
  sendMessage: string;
  sendPDF: string;
  sendPDFViaWhatsApp: string;
  phoneNumber: string;
  phoneNumberRequired: string;
  phoneNumberFormat: string;
  pdfNotGenerated: string;
  pdfSendError: string;
  preview: string;
  formatting: string;
  bold: string;
  italic: string;
  bulletList: string;
  lineBreak: string;
  
  // Footer Content
  validity: string;
  validityPeriod: string;
  validityMonths: string;
  paymentTerms: string;
  paymentDetails: string;
  advancePercentage: string;
  advanceAmount: string;
  advanceType: string;
  deliveryPercentage: string;
  deliveryAmount: string;
  deliveryType: string;
  includeDelivery: string;
  paymentTermsTitle: string;
  advancePayment: string;
  deliveryPayment: string;
  percentage: string;
  amount: string;
  paymentTip: string;
  themeProfessional: string;
  themeModern: string;
  themeMinimal: string;
  themeColorful: string;
  edit: string;
  cancel: string;
  company: string;
  address: string;
  phone: string;
  email: string;
  validityHeader: string;
  paymentTermsHeader: string;
  documentType: string;
  facture: string;
  devis: string;
  companyLogo: string;
  uploadLogo: string;
  removeLogo: string;
  signature: string;
  totalHTLabel: string;
  vatLabel: string;
  totalTTCLabel: string;
  
  // Auto-save functionality
  clearInvoice: string;
  startNew: string;
  lastSaved: string;
  autoSaveEnabled: string;
  autoSaveDisabled: string;
  saveStatus: string;
  saved: string;
  saving: string;
  unsaved: string;
  
  // Company Info Editor
  companyInformation: string;
  companyName: string;
  companyNameRequired: string;
  addressRequired: string;
  invalidEmail: string;
  website: string;
  saveChanges: string;
  
  // Multi-page PDF features
  compactMode: string;
  pageNumber: string;
  pageOf: string;
  continuedOnNextPage: string;
  continuedFromPreviousPage: string;
  // Footer text
  defaultFooter: string;
  // Error messages
  error: string;
  errorGeneratingPDF: string;
  errorOpeningWhatsApp: string;
  // Actions
  removeItem: string;
  // Alt text
  companyLogoAlt: string;
  // Placeholders
  phoneNumberPlaceholder: string;
  addressPlaceholder: string;
  emailPlaceholder: string;
  websitePlaceholder: string;
}

export const translations: Record<string, Translations> = {
  en: {
    // App Header
    appTitle: "Micro-Invoice Generator",
    appSubtitle: "Create professional invoices instantly",
    customize: "Customize",
    
    // Form Labels
    basicInformation: "Basic Information",
    clientName: "Client Name *",
    dueDate: "Due Date *",
    customInvoiceNumber: "Custom Invoice Number *",
    useCustomInvoiceNumber: "Use custom invoice number",
    optional: "(Optional)",
    invoiceSettings: "Invoice Settings",
    currency: "Currency",
    useMultipleLineItems: "Use multiple line items",
    lineItems: "Line Items",
    addItem: "Add Item",
    description: "Description",
    quantity: "Qty",
    unitPrice: "Unit Price",
    tax: "Tax (%)",
    applyOverallTax: "Apply overall tax instead of individual taxes",
    overallTaxRate: "Overall Tax Rate (%)",
    enterTotalManually: "Enter total manually",
    manualTotal: "Manual Total *",
    subtotal: "Subtotal:",
    total: "Total:",
    totalIndividualTaxes: "Total Individual Taxes:",
    overallTax: "Overall Tax",
    generateInvoice: "Generate Invoice",
    generating: "Generating...",
    resetForm: "Reset Form",
    
    // Placeholders
    clientNamePlaceholder: "Enter client name",
    serviceDescriptionPlaceholder: "Enter service description",
    itemDescriptionPlaceholder: "Item description",
    quantityPlaceholder: "1",
    unitPricePlaceholder: "0.00",
    taxPlaceholder: "0",
    customInvoiceNumberPlaceholder: "INV-2025-001",
    manualTotalPlaceholder: "0.00",
    overallTaxPlaceholder: "0",
    validityMonthsPlaceholder: "3",
    advancePercentagePlaceholder: "40",
    advanceAmountPlaceholder: "0.00",
    deliveryPercentagePlaceholder: "60",
    deliveryAmountPlaceholder: "0.00",
    
    // Invoice Content
    invoice: "INVOICE",
    invoiceNumber: "Invoice #",
    invoiceDate: "Invoice Date",
    from: "From:",
    billTo: "Bill To:",
    items: "Items",
    qty: "Qty",
    designation: "Description",
    vat: "VAT (%)",
    unitPriceHT: "Unit Price HT",
    totalHT: "Total HT",
    dueDateLabel: "Due Date:",
    
    // Actions
    downloadPDF: "Download PDF",
    sendViaWhatsApp: "Send via WhatsApp",
    newInvoice: "New Invoice",
    editInvoiceDetails: "Edit Invoice Details",
    createNewInvoice: "Create New Invoice",
    
    // Features
    features: "Features",
    professionalInvoices: "Professional Invoices",
    professionalInvoicesDesc: "Generate clean, professional invoices with automatic calculations",
    pdfDownload: "PDF Download",
    pdfDownloadDesc: "Download invoices as high-quality PDF files for record keeping",
    whatsappSharing: "WhatsApp Sharing",
    whatsappSharingDesc: "Share invoice details directly via WhatsApp with pre-formatted messages",
    
    // Footer
    footerCopyright: "© 2025 Micro-Invoice Generator. Built for freelancers and small businesses.",
    footerSubtitle: "No registration required • Secure • Free to use",
    
    // Error Messages
    clientNameRequired: "Client name is required",
    dueDateRequired: "Due date is required",
    dueDatePast: "Due date cannot be in the past",
    customInvoiceNumberRequired: "Custom invoice number is required when enabled",
    manualTotalRequired: "Manual total must be at least 0.01",
    manualTotalMinimum: "Manual total must be at least 0.01",
    overallTaxRequired: "Overall tax rate must be at least 0",
    lineItemsRequired: "At least one line item with description and price is required",
    serviceDescriptionRequired: "Service description is required",
    priceRequired: "Price must be at least 0.01",
    priceMinimum: "Price must be at least 0.01",
    
    // WhatsApp Messages
    invoiceFor: "Invoice for",
    whatsappItems: "Items:",
    whatsappTotal: "Total:",
    due: "Due:",
    thankYou: "Thank you for your business!",
    service: "Service",
    
    // WhatsApp Editor
    whatsappMessagePreview: "WhatsApp Message Preview",
    whatsappMessage: "WhatsApp Message",
    whatsappMessagePlaceholder: "Edit your WhatsApp message here...",
    customMessage: "Custom Message",
    customMessagePlaceholder: "Add a personal message here...",
    sendMessage: "Send Message",
    sendPDF: "Send PDF",
    sendPDFViaWhatsApp: "Send PDF via WhatsApp",
    phoneNumber: "Phone Number",
    phoneNumberRequired: "Phone number is required",
    phoneNumberFormat: "Format: +33 6 12 34 56 78",
    pdfNotGenerated: "PDF not generated yet",
    pdfSendError: "Error sending PDF",
    preview: "Preview",
    formatting: "Formatting:",
    bold: "Bold",
    italic: "Italic",
    bulletList: "Bullet List",
    lineBreak: "Line Break",
    
    // Footer Content
    validity: "Validity (3 months)",
    validityPeriod: "3 months from invoice date",
    validityMonths: "months from invoice date",
    paymentTerms: "Payment terms (40%/60%)",
    paymentDetails: "40% advance, 60% on delivery",
    advancePercentage: "advance",
    advanceAmount: "Advance Amount",
    advanceType: "Advance Type",
    deliveryPercentage: "on delivery",
    deliveryAmount: "Delivery Amount",
    deliveryType: "Delivery Type",
    includeDelivery: "Include Delivery Payment",
    paymentTermsTitle: "Payment Terms",
    advancePayment: "Advance Payment:",
    deliveryPayment: "Delivery Payment:",
    percentage: "Percentage",
    amount: "Amount",
    paymentTip: "💡 Tip: Enter either the percentage or amount - the other will be calculated automatically based on the total invoice amount.",
    themeProfessional: "Professional",
    themeModern: "Modern",
    themeMinimal: "Minimal",
    themeColorful: "Colorful",
    edit: "Edit",
    cancel: "Cancel",
    company: "Company:",
    address: "Address:",
    phone: "Phone:",
    email: "Email:",
    validityHeader: "Validity",
    paymentTermsHeader: "Payment Terms",
    documentType: "Document Type",
    facture: "INVOICE",
    devis: "QUOTE",
    companyLogo: "Company Logo",
    uploadLogo: "Upload Logo",
    removeLogo: "Remove Logo",
    signature: "Signature",
    totalHTLabel: "Total HT",
    vatLabel: "VAT",
    totalTTCLabel: "Total TTC",
    
         // Auto-save functionality
     clearInvoice: "Clear Invoice",
     startNew: "Start New",
     lastSaved: "Last Saved",
     autoSaveEnabled: "Auto-save enabled",
     autoSaveDisabled: "Auto-save disabled",
     saveStatus: "Save Status",
     saved: "Saved",
     saving: "Saving...",
     unsaved: "Unsaved",
     
           // Company Info Editor
      companyInformation: "Company Information",
      companyName: "Company Name",
      companyNameRequired: "Company name is required",
      addressRequired: "Address is required",
      invalidEmail: "Please enter a valid email address",
      website: "Website",
      saveChanges: "Save Changes",
      
      // Multi-page PDF features
      compactMode: "Compact Mode",
      pageNumber: "Page",
      pageOf: "of",
          continuedOnNextPage: "Continued on next page...",
    continuedFromPreviousPage: "Continued from previous page...",
    defaultFooter: "Thank you for your business! Please remit payment by the due date specified above.",
    error: "Error",
    errorGeneratingPDF: "Failed to generate PDF. Please try again.",
    errorOpeningWhatsApp: "Failed to open WhatsApp. Please try again.",
    removeItem: "Remove item",
    companyLogoAlt: "Company Logo",
    phoneNumberPlaceholder: "+33 6 12 34 56 78",
    addressPlaceholder: "123 Business Street\nCity, State 12345",
    emailPlaceholder: "contact@yourcompany.com",
    websitePlaceholder: "www.yourcompany.com",
  },
  
  fr: {
    // App Header
    appTitle: "Générateur de Micro-Factures",
    appSubtitle: "Créez des factures professionnelles instantanément",
    customize: "Personnaliser",
    
    // Form Labels
    basicInformation: "Informations de Base",
    clientName: "Nom du Client *",
    dueDate: "Date d'Échéance *",
    customInvoiceNumber: "Numéro de Facture Personnalisé *",
    useCustomInvoiceNumber: "Utiliser un numéro de facture personnalisé",
    optional: "(Optionnel)",
    invoiceSettings: "Paramètres de Facture",
    currency: "Devise",
    useMultipleLineItems: "Utiliser plusieurs articles",
    lineItems: "Articles",
    addItem: "Ajouter un Article",
    description: "Description",
    quantity: "Qté",
    unitPrice: "Prix Unitaire",
    tax: "Taxe (%)",
    applyOverallTax: "Appliquer une taxe globale au lieu des taxes individuelles",
    overallTaxRate: "Taux de Taxe Globale (%)",
    enterTotalManually: "Saisir le total manuellement",
    manualTotal: "Total Manuel *",
    subtotal: "Sous-total :",
    total: "Total :",
    totalIndividualTaxes: "Total des Taxes Individuelles :",
    overallTax: "Taxe Globale",
    generateInvoice: "Générer la Facture",
    generating: "Génération...",
    resetForm: "Réinitialiser le Formulaire",
    
    // Placeholders
    clientNamePlaceholder: "Entrez le nom du client",
    serviceDescriptionPlaceholder: "Entrez la description du service",
    itemDescriptionPlaceholder: "Description de l'article",
    quantityPlaceholder: "1",
    unitPricePlaceholder: "0,00",
    taxPlaceholder: "0",
    customInvoiceNumberPlaceholder: "FACT-2025-001",
    manualTotalPlaceholder: "0,00",
    overallTaxPlaceholder: "0",
    validityMonthsPlaceholder: "3",
    advancePercentagePlaceholder: "40",
    advanceAmountPlaceholder: "0,00",
    deliveryPercentagePlaceholder: "60",
    deliveryAmountPlaceholder: "0,00",
    
    // Invoice Content
    invoice: "FACTURE",
    invoiceNumber: "Facture #",
    invoiceDate: "Date de Facture",
    from: "De :",
    billTo: "Facturer à :",
    items: "Articles",
    qty: "Qté",
    designation: "Désignation",
    vat: "TVA (%)",
    unitPriceHT: "Prix Unit. HT",
    totalHT: "Total HT",
    dueDateLabel: "Date d'Échéance :",
    
    // Actions
    downloadPDF: "Télécharger PDF",
    sendViaWhatsApp: "Envoyer via WhatsApp",
    newInvoice: "Nouvelle Facture",
    editInvoiceDetails: "Modifier les Détails de la Facture",
    createNewInvoice: "Créer une Nouvelle Facture",
    
    // Features
    features: "Fonctionnalités",
    professionalInvoices: "Factures Professionnelles",
    professionalInvoicesDesc: "Générez des factures propres et professionnelles avec des calculs automatiques",
    pdfDownload: "Téléchargement PDF",
    pdfDownloadDesc: "Téléchargez les factures en fichiers PDF haute qualité pour la conservation",
    whatsappSharing: "Partage WhatsApp",
    whatsappSharingDesc: "Partagez les détails de facture directement via WhatsApp avec des messages pré-formatés",
    
    // Footer
    footerCopyright: "© 2025 Générateur de Micro-Factures. Conçu pour les freelances et petites entreprises.",
    footerSubtitle: "Aucune inscription requise • Sécurisé • Gratuit",
    
    // Error Messages
    clientNameRequired: "Le nom du client est requis",
    dueDateRequired: "La date d'échéance est requise",
    dueDatePast: "La date d'échéance ne peut pas être dans le passé",
    customInvoiceNumberRequired: "Le numéro de facture personnalisé est requis quand activé",
    manualTotalRequired: "Le total manuel doit être d'au moins 0,01",
    manualTotalMinimum: "Le total manuel doit être d'au moins 0,01",
    overallTaxRequired: "Le taux de taxe globale doit être d'au moins 0",
    lineItemsRequired: "Au moins un article avec description et prix est requis",
    serviceDescriptionRequired: "La description du service est requise",
    priceRequired: "Le prix doit être d'au moins 0,01",
    priceMinimum: "Le prix doit être d'au moins 0,01",
    
    // WhatsApp Messages
    invoiceFor: "Facture pour",
    whatsappItems: "Articles :",
    whatsappTotal: "Total :",
    due: "Échéance :",
    thankYou: "Merci pour votre confiance !",
    service: "Service",
    
    // WhatsApp Editor
    whatsappMessagePreview: "Aperçu du Message WhatsApp",
    whatsappMessage: "Message WhatsApp",
    whatsappMessagePlaceholder: "Modifiez votre message WhatsApp ici...",
    customMessage: "Message Personnalisé",
    customMessagePlaceholder: "Ajoutez un message personnel ici...",
    sendMessage: "Envoyer le Message",
    sendPDF: "Envoyer le PDF",
    sendPDFViaWhatsApp: "Envoyer le PDF via WhatsApp",
    phoneNumber: "Numéro de Téléphone",
    phoneNumberRequired: "Le numéro de téléphone est requis",
    phoneNumberFormat: "Format: +33 6 12 34 56 78",
    pdfNotGenerated: "PDF non généré encore",
    pdfSendError: "Erreur lors de l'envoi du PDF",
    preview: "Aperçu",
    formatting: "Formatage :",
    bold: "Gras",
    italic: "Italique",
    bulletList: "Liste à puces",
    lineBreak: "Saut de ligne",
    
    // Footer Content
    validity: "Validité (3 mois)",
    validityPeriod: "3 mois à partir de la date de facture",
    validityMonths: "mois à partir de la date de facture",
    paymentTerms: "Conditions de paiement (40%/60%)",
    paymentDetails: "40% d'acompte, 60% à la livraison",
    advancePercentage: "d'acompte",
    advanceAmount: "Montant d'acompte",
    advanceType: "Type d'acompte",
    deliveryPercentage: "à la livraison",
    deliveryAmount: "Montant de livraison",
    deliveryType: "Type de livraison",
    includeDelivery: "Inclure le paiement de livraison",
    paymentTermsTitle: "Conditions de paiement",
    advancePayment: "Paiement d'acompte :",
    deliveryPayment: "Paiement de livraison :",
    percentage: "Pourcentage",
    amount: "Montant",
    paymentTip: "💡 Conseil : Entrez soit le pourcentage soit le montant - l'autre sera calculé automatiquement en fonction du montant total de la facture.",
    themeProfessional: "Professionnel",
    themeModern: "Moderne",
    themeMinimal: "Minimal",
    themeColorful: "Coloré",
    edit: "Modifier",
    cancel: "Annuler",
    company: "Entreprise :",
    address: "Adresse :",
    phone: "Téléphone :",
    email: "Email :",
    validityHeader: "Validité",
    paymentTermsHeader: "Conditions de paiement",
    documentType: "Type de document",
    facture: "FACTURE",
    devis: "DEVIS",
    companyLogo: "Logo de l'entreprise",
    uploadLogo: "Télécharger le logo",
    removeLogo: "Supprimer le logo",
    signature: "Signature",
    totalHTLabel: "Total HT",
    vatLabel: "TVA",
    totalTTCLabel: "Total TTC",
    
         // Auto-save functionality
     clearInvoice: "Effacer la facture",
     startNew: "Commencer nouveau",
     lastSaved: "Dernière sauvegarde",
     autoSaveEnabled: "Sauvegarde automatique activée",
     autoSaveDisabled: "Sauvegarde automatique désactivée",
     saveStatus: "Statut de sauvegarde",
     saved: "Sauvegardé",
     saving: "Sauvegarde...",
     unsaved: "Non sauvegardé",
     
           // Company Info Editor
      companyInformation: "Informations de l'entreprise",
      companyName: "Nom de l'entreprise",
      companyNameRequired: "Le nom de l'entreprise est requis",
      addressRequired: "L'adresse est requise",
      invalidEmail: "Veuillez entrer une adresse email valide",
      website: "Site web",
      saveChanges: "Enregistrer les modifications",
      
      // Multi-page PDF features
      compactMode: "Mode compact",
      pageNumber: "Page",
      pageOf: "sur",
          continuedOnNextPage: "Suite à la page suivante...",
    continuedFromPreviousPage: "Suite de la page précédente...",
    defaultFooter: "Merci pour votre confiance ! Veuillez effectuer le paiement avant la date d'échéance indiquée ci-dessus.",
    error: "Erreur",
    errorGeneratingPDF: "Échec de la génération du PDF. Veuillez réessayer.",
    errorOpeningWhatsApp: "Échec de l'ouverture de WhatsApp. Veuillez réessayer.",
    removeItem: "Supprimer l'article",
    companyLogoAlt: "Logo de l'entreprise",
    phoneNumberPlaceholder: "+33 6 12 34 56 78",
    addressPlaceholder: "123 Rue de l'Entreprise\nVille, État 12345",
    emailPlaceholder: "contact@votreentreprise.com",
    websitePlaceholder: "www.votreentreprise.com",
  },
  
  ar: {
    // App Header
    appTitle: "مولد الفواتير المصغرة",
    appSubtitle: "أنشئ فواتير احترافية فوراً",
    customize: "تخصيص",
    
    // Form Labels
    basicInformation: "المعلومات الأساسية",
    clientName: "اسم العميل *",
    dueDate: "تاريخ الاستحقاق *",
    customInvoiceNumber: "رقم الفاتورة المخصص *",
    useCustomInvoiceNumber: "استخدم رقم فاتورة مخصص",
    optional: "(اختياري)",
    invoiceSettings: "إعدادات الفاتورة",
    currency: "العملة",
    useMultipleLineItems: "استخدم عناصر متعددة",
    lineItems: "السلع",
    addItem: "إضافة سلعة",
    description: "الوصف",
    quantity: "الكمية",
    unitPrice: "سعر الوحدة",
    tax: "الضريبة (%)",
    applyOverallTax: "تطبيق ضريبة شاملة بدلاً من الضرائب الفردية",
    overallTaxRate: "معدل الضريبة الشاملة (%)",
    enterTotalManually: "أدخل المجموع يدوياً",
    manualTotal: "المجموع اليدوي *",
    subtotal: "المجموع الفرعي:",
    total: "المجموع:",
    totalIndividualTaxes: "مجموع الضرائب الفردية:",
    overallTax: "الضريبة الشاملة",
    generateInvoice: "إنشاء الفاتورة",
    generating: "جاري الإنشاء...",
    resetForm: "إعادة تعيين النموذج",
    
    // Placeholders
    clientNamePlaceholder: "أدخل اسم العميل",
    serviceDescriptionPlaceholder: "أدخل وصف الخدمة",
    itemDescriptionPlaceholder: "وصف السلعة",
    quantityPlaceholder: "1",
    unitPricePlaceholder: "0.00",
    taxPlaceholder: "0",
    customInvoiceNumberPlaceholder: "فاتورة-2025-001",
    manualTotalPlaceholder: "0.00",
    overallTaxPlaceholder: "0",
    validityMonthsPlaceholder: "3",
    advancePercentagePlaceholder: "40",
    advanceAmountPlaceholder: "0.00",
    deliveryPercentagePlaceholder: "60",
    deliveryAmountPlaceholder: "0.00",
    
    // Invoice Content
    invoice: "فاتورة",
    invoiceNumber: "رقم الفاتورة",
    invoiceDate: "تاريخ الفاتورة",
    from: "من:",
    billTo: "فاتورة إلى:",
    items: "السلع",
    qty: "الكمية",
    designation: "الوصف",
    vat: "الضريبة (%)",
    unitPriceHT: "سعر الوحدة بدون ضريبة",
    totalHT: "المجموع بدون ضريبة",
    dueDateLabel: "تاريخ الاستحقاق:",
    
    // Actions
    downloadPDF: "تحميل PDF",
    sendViaWhatsApp: "إرسال عبر واتساب",
    newInvoice: "فاتورة جديدة",
    editInvoiceDetails: "تعديل تفاصيل الفاتورة",
    createNewInvoice: "إنشاء فاتورة جديدة",
    
    // Features
    features: "المميزات",
    professionalInvoices: "فواتير احترافية",
    professionalInvoicesDesc: "أنشئ فواتير نظيفة واحترافية مع حسابات تلقائية",
    pdfDownload: "تحميل PDF",
    pdfDownloadDesc: "حمل الفواتير كملفات PDF عالية الجودة للحفظ",
    whatsappSharing: "مشاركة واتساب",
    whatsappSharingDesc: "شارك تفاصيل الفاتورة مباشرة عبر واتساب مع رسائل مُعدة مسبقاً",
    
    // Footer
    footerCopyright: "© 2025 مولد الفواتير المصغرة. مبني للمستقلين والشركات الصغيرة.",
    footerSubtitle: "لا يتطلب تسجيل • آمن • مجاني للاستخدام",
    
    // Error Messages
    clientNameRequired: "اسم العميل مطلوب",
    dueDateRequired: "تاريخ الاستحقاق مطلوب",
    dueDatePast: "تاريخ الاستحقاق لا يمكن أن يكون في الماضي",
    customInvoiceNumberRequired: "رقم الفاتورة المخصص مطلوب عند التفعيل",
    manualTotalRequired: "المجموع اليدوي يجب أن يكون 0.01 على الأقل",
    manualTotalMinimum: "المجموع اليدوي يجب أن يكون 0.01 على الأقل",
    overallTaxRequired: "معدل الضريبة الشاملة يجب أن يكون 0 على الأقل",
    lineItemsRequired: "سلعة واحدة على الأقل مع الوصف والسعر مطلوب",
    serviceDescriptionRequired: "وصف الخدمة مطلوب",
    priceRequired: "السعر يجب أن يكون 0.01 على الأقل",
    priceMinimum: "السعر يجب أن يكون 0.01 على الأقل",
    
    // WhatsApp Messages
    invoiceFor: "فاتورة لـ",
    whatsappItems: "السلع:",
    whatsappTotal: "المجموع:",
    due: "الاستحقاق:",
    thankYou: "شكراً لثقتكم!",
    service: "الخدمة",
    
    // WhatsApp Editor
    whatsappMessagePreview: "معاينة رسالة واتساب",
    whatsappMessage: "رسالة واتساب",
    whatsappMessagePlaceholder: "عدل رسالة واتساب هنا...",
    customMessage: "رسالة مخصصة",
    customMessagePlaceholder: "أضف رسالة شخصية هنا...",
    sendMessage: "إرسال الرسالة",
    sendPDF: "إرسال PDF",
    sendPDFViaWhatsApp: "إرسال PDF عبر واتساب",
    phoneNumber: "رقم الهاتف",
    phoneNumberRequired: "رقم الهاتف مطلوب",
    phoneNumberFormat: "التنسيق: +33 6 12 34 56 78",
    pdfNotGenerated: "PDF لم يتم إنشاؤه بعد",
    pdfSendError: "خطأ في إرسال PDF",
    preview: "معاينة",
    formatting: "التنسيق:",
    bold: "عريض",
    italic: "مائل",
    bulletList: "قائمة نقطية",
    lineBreak: "سطر جديد",
    
    // Footer Content
    validity: "الصلاحية (3 أشهر)",
    validityPeriod: "3 أشهر من تاريخ الفاتورة",
    validityMonths: "أشهر من تاريخ الفاتورة",
    paymentTerms: "شروط الدفع (40%/60%)",
    paymentDetails: "40% مقدم، 60% عند التسليم",
    advancePercentage: "مقدم",
    advanceAmount: "مبلغ المقدم",
    advanceType: "نوع المقدم",
    deliveryPercentage: "عند التسليم",
    deliveryAmount: "مبلغ التسليم",
    deliveryType: "نوع التسليم",
    includeDelivery: "تضمين دفع التسليم",
    paymentTermsTitle: "شروط الدفع",
    advancePayment: "دفع المقدم:",
    deliveryPayment: "دفع التسليم:",
    percentage: "النسبة المئوية",
    amount: "المبلغ",
    paymentTip: "💡 نصيحة: أدخل إما النسبة المئوية أو المبلغ - سيتم حساب الآخر تلقائياً بناءً على إجمالي مبلغ الفاتورة.",
    themeProfessional: "احترافي",
    themeModern: "حديث",
    themeMinimal: "مبسط",
    themeColorful: "ملون",
    edit: "تعديل",
    cancel: "إلغاء",
    company: "الشركة:",
    address: "العنوان:",
    phone: "الهاتف:",
    email: "البريد الإلكتروني:",
    validityHeader: "الصلاحية",
    paymentTermsHeader: "شروط الدفع",
    documentType: "نوع المستند",
    facture: "فاتورة",
    devis: "عرض سعر",
    companyLogo: "شعار الشركة",
    uploadLogo: "رفع الشعار",
    removeLogo: "إزالة الشعار",
    signature: "التوقيع",
    totalHTLabel: "المجموع بدون ضريبة",
    vatLabel: "الضريبة",
    totalTTCLabel: "المجموع مع الضريبة",
    
         // Auto-save functionality
     clearInvoice: "مسح الفاتورة",
     startNew: "بدء جديد",
     lastSaved: "آخر حفظ",
     autoSaveEnabled: "الحفظ التلقائي مفعل",
     autoSaveDisabled: "الحفظ التلقائي معطل",
     saveStatus: "حالة الحفظ",
     saved: "محفوظ",
     saving: "جاري الحفظ...",
     unsaved: "غير محفوظ",
     
           // Company Info Editor
      companyInformation: "معلومات الشركة",
      companyName: "اسم الشركة",
      companyNameRequired: "اسم الشركة مطلوب",
      addressRequired: "العنوان مطلوب",
      invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صحيح",
      website: "الموقع الإلكتروني",
      saveChanges: "حفظ التغييرات",
      
      // Multi-page PDF features
      compactMode: "الوضع المضغوط",
      pageNumber: "صفحة",
      pageOf: "من",
      continuedOnNextPage: "يتبع في الصفحة التالية...",
      continuedFromPreviousPage: "يتبع من الصفحة السابقة...",
      defaultFooter: "شكراً لثقتكم! يرجى سداد المبلغ قبل تاريخ الاستحقاق المحدد أعلاه.",
      error: "خطأ",
      errorGeneratingPDF: "فشل في إنشاء PDF. يرجى المحاولة مرة أخرى.",
      errorOpeningWhatsApp: "فشل في فتح واتساب. يرجى المحاولة مرة أخرى.",
      removeItem: "إزالة العنصر",
      companyLogoAlt: "شعار الشركة",
      phoneNumberPlaceholder: "+33 6 12 34 56 78",
      addressPlaceholder: "123 شارع الأعمال\nالمدينة، الولاية 12345",
      emailPlaceholder: "contact@yourcompany.com",
      websitePlaceholder: "www.yourcompany.com",
  }
};

export const getTranslation = (language: string, key: keyof Translations): string => {
  return translations[language]?.[key] || translations.en[key] || key;
}; 