import html2pdf from 'html2pdf.js';

export interface PDFOptions {
  filename: string;
  clientName: string;
}

export const generatePDF = async (elementId: string, options: PDFOptions): Promise<Blob> => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Invoice element not found');
  }

  // Clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Apply basic print styles
  clonedElement.style.padding = '20px';
  clonedElement.style.margin = '0';
  clonedElement.style.backgroundColor = 'white';
  clonedElement.style.color = 'black';
  
  // Add minimal print styles
  const style = document.createElement('style');
  style.textContent = `
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background: white;
      color: black;
    }
    .print-hidden {
      display: none !important;
    }
    .line-item {
      page-break-inside: avoid;
    }
    .totals-section {
      page-break-inside: avoid;
    }
  `;
  clonedElement.appendChild(style);
  
  const opt = {
    margin: [0.3, 0.3, 0.3, 0.3],
    filename: options.filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    }
  };

  try {
    const pdf = await html2pdf().set(opt).from(clonedElement).outputPdf('blob');
    return pdf;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const generatePDFAndDownload = async (elementId: string, options: PDFOptions): Promise<void> => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Invoice element not found');
  }

  // Clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Apply basic print styles
  clonedElement.style.padding = '20px';
  clonedElement.style.margin = '0';
  clonedElement.style.backgroundColor = 'white';
  clonedElement.style.color = 'black';
  
  // Add minimal print styles
  const style = document.createElement('style');
  style.textContent = `
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background: white;
      color: black;
    }
    .print-hidden {
      display: none !important;
    }
    .line-item {
      page-break-inside: avoid;
    }
    .totals-section {
      page-break-inside: avoid;
    }
  `;
  clonedElement.appendChild(style);
  
  const opt = {
    margin: [0.3, 0.3, 0.3, 0.3],
    filename: options.filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    }
  };

  try {
    await html2pdf().set(opt).from(clonedElement).save();
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const createPDFFilename = (clientName: string): string => {
  // Sanitize client name for filename
  const sanitizedName = clientName
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 20);
  
  const date = new Date().toISOString().split('T')[0];
  return `Invoice_${sanitizedName}_${date}.pdf`;
};