# ChromaSnap 🎨

A modern, feature-rich Color Palette Generator built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

### 🖼️ Image Upload
- Drag-and-drop or click to upload
- Supports JPG, PNG, SVG, WebP, and GIF formats
- Real-time image preview with metadata

### 🎨 Color Extraction
**Two Intelligent Modes:**
- **Auto-detect Mode**: Automatically identifies all unique colors in simple swatch images
- **Manual Mode**: Extract 2-20 colors from complex images using advanced quantization

### 📊 Comprehensive Color Information
Each extracted color displays:
- **HEX** color code (e.g., `#FF5733`)
- **RGB** values (e.g., `rgb(255, 87, 51)`)
- **CMYK** values (e.g., `cmyk(0%, 66%, 80%, 0%)`)
- One-click copy functionality for all values

### 💾 Export Options
- **PDF**: High-quality printable palette
- **HTML**: Standalone web page with embedded palette
- **PNG/JPG**: Raster image exports for presentations

### 🌓 Dark/Light Mode
- System-aware theme detection
- Manual theme toggle
- Consistent styling across all components

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Color Extraction**: [ColorThief](https://github.com/lokesh/color-thief)
- **Export**: [html2canvas](https://html2canvas.hertzen.com/), [jsPDF](https://github.com/parallax/jsPDF)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
chromasnap/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Main application page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── theme-provider.tsx  # Theme context provider
│   │   ├── theme-toggle.tsx    # Dark/light mode toggle
│   │   ├── image-uploader.tsx  # Drag-and-drop upload
│   │   ├── image-preview.tsx   # Image preview display
│   │   ├── extraction-controls.tsx  # Mode and color count controls
│   │   ├── palette-grid.tsx    # Palette display grid
│   │   ├── color-swatch-card.tsx   # Individual color card
│   │   └── export-actions.tsx  # Export functionality
│   └── lib/
│       ├── types.ts            # TypeScript type definitions
│       ├── color-utils.ts      # Color conversion utilities
│       ├── color-extraction.ts # Color extraction logic
│       └── exporters.ts        # Export functionality
├── public/                     # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

## How It Works

### Color Extraction

**Manual Mode:**
- Uses ColorThief's k-means quantization algorithm
- Extracts dominant colors from complex images
- Configurable color count (2-20)

**Auto-detect Mode:**
- Analyzes canvas pixel data
- Groups similar colors within tolerance threshold
- Perfect for flat color swatch images
- Falls back to quantization for complex images

### Export System

All exports use the browser's native capabilities:
- **PDF/PNG/JPG**: html2canvas renders the palette section to canvas, then converts to desired format
- **HTML**: Generates a standalone HTML document with embedded CSS and color data

## Accessibility

- Keyboard navigation support
- ARIA labels for interactive elements
- Focus states for all controls
- High contrast ratios in both themes

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with ES2017+ support

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Color extraction powered by [ColorThief](https://github.com/lokesh/color-thief)
- UI components inspired by modern design systems
- Built with the amazing Next.js and Tailwind CSS ecosystems

