# Micro-Invoice Generator

A lightweight web application for freelancers and small business owners to quickly generate professional invoices and share them via WhatsApp.

## Features

### 🎨 **Enhanced UX & Customization**
- **Multiple Themes**: Choose from Professional, Modern, Minimal, or Colorful invoice themes
- **Currency Support**: USD, EUR, GBP, CAD, AUD with proper formatting
- **Custom Invoice Numbers**: Optional custom invoice numbering system
- **Company Information**: Editable company details with validation
- **Real-time Preview**: Live invoice preview with theme changes

### 📝 **Advanced Invoice Features**
- **Line Items Support**: Add multiple line items with quantities and unit prices
- **Automatic Calculations**: Subtotal, tax, and total calculations
- **Professional Layout**: Clean, professional invoice design
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 💾 **Data Management**
- **Auto-save**: Form data is automatically saved to localStorage
- **Form Validation**: Real-time validation with helpful error messages
- **Reset Functionality**: Easy form reset with confirmation

### 📤 **Export & Sharing**
- **PDF Download**: High-quality PDF generation using html2pdf.js
- **WhatsApp Integration**: Direct sharing via WhatsApp with formatted messages
- **Professional Formatting**: Currency-aware messaging

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd micro-invoice-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating an Invoice

1. **Basic Information**
   - Enter client name (required)
   - Set due date (required)
   - Optionally set a custom invoice number

2. **Invoice Settings**
   - Choose your preferred currency
   - Select an invoice theme
   - Customize company information

3. **Service Details**
   - **Single Service**: Enter service description and price
   - **Line Items**: Toggle to add multiple items with quantities and unit prices

4. **Generate & Share**
   - Preview the invoice in real-time
   - Download as PDF
   - Share via WhatsApp

### Customization Options

#### Themes
- **Professional**: Blue accent colors, clean layout
- **Modern**: Dark gray accents, contemporary design
- **Minimal**: Simple borders, clean typography
- **Colorful**: Purple accents, vibrant design

#### Currencies
- USD ($) - US Dollar
- EUR (€) - Euro
- GBP (£) - British Pound
- CAD (C$) - Canadian Dollar
- AUD (A$) - Australian Dollar

## Technical Details

### Built With
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **html2pdf.js** - PDF generation
- **Lucide React** - Beautiful icons

### Project Structure
```
src/
├── components/
│   ├── InvoiceForm.tsx      # Main invoice form
│   ├── InvoicePreview.tsx   # Invoice preview component
│   └── CompanyInfoEditor.tsx # Company info editor
├── utils/
│   ├── pdfGenerator.ts      # PDF generation utilities
│   └── whatsappShare.ts    # WhatsApp sharing utilities
├── App.tsx                 # Main application component
└── main.tsx               # Application entry point
```

### Key Features Implementation

#### Form Validation
- Real-time validation with error highlighting
- Required field validation
- Date validation (no past dates)
- Email format validation
- Price validation (minimum $0.01)

#### Auto-save
- Form data automatically saved to localStorage
- Data persists across browser sessions
- Graceful error handling for corrupted data

#### Theme System
- CSS-in-JS theme definitions
- Dynamic class application
- Consistent color schemes across components

#### Currency Support
- International number formatting
- Currency symbol display
- WhatsApp message formatting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built for freelancers and small businesses who need a quick, professional invoice solution.** 