# PaletParrot

Extract color palettes from any image.

PaletParrot is a palette extraction app for developers and designers. Upload an image, extract colors, rename swatches, inspect color values, and export the result as image files or code.

## Features

- Upload images (`JPG`, `PNG`, `SVG`, `WebP`, `GIF`) via drag & drop or file picker
- Three extraction modes:
  - **Auto-detect** for exact colors in simple images
  - **Manual** for dominant colors in complex images
  - **Eyedropper** to click and pick exact pixels
- HEX, RGB, and CMYK values for every color
- Editable color labels such as `primary`, `secondary`, and `accent`
- Image exports: `PDF`, `PNG`, `JPG`
- Code exports: `HTML`, `CSS Variables`, `SCSS Variables`, `Tailwind Config`
- Popup code preview with copy and download actions
- Dark/light mode
- Responsive design

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- ColorThief
- html2canvas
- jsPDF
- next-themes

## Getting Started

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build

```bash
npm run build
```

## Project Structure

- `src/app` — app entrypoints, layout, and global styles
- `src/components` — upload, extraction controls, palette UI, theming, and export actions
- `src/lib` — color extraction, conversion helpers, exporters, and shared types

## License

MIT
