'use client';

import { Braces, Download, FileCode2, FileImage, FileText } from 'lucide-react';
import { useState } from 'react';
import type { ExtractedColor, ExportFormat } from '@/lib/types';
import {
  exportAsCss,
  exportAsHtml,
  exportAsJpg,
  exportAsPdf,
  exportAsPng,
  exportAsScss,
  exportAsTailwind,
  getCodeExportPreview,
} from '@/lib/exporters';

interface ExportActionsProps {
  colors: ExtractedColor[];
  disabled?: boolean;
}

interface ExportButtonProps {
  format: ExportFormat;
  icon: React.ElementType;
  label: string;
  exporting: ExportFormat | null;
  disabled: boolean;
  onExport: (format: ExportFormat) => void;
}

function ExportButton({
  format,
  icon: Icon,
  label,
  exporting,
  disabled,
  onExport,
}: ExportButtonProps) {
  return (
    <button
      onClick={() => onExport(format)}
      disabled={disabled || exporting !== null}
      className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      <Icon className="h-4 w-4" />
      {exporting === format ? 'Exporting...' : label}
    </button>
  );
}

export function ExportActions({ colors, disabled = false }: ExportActionsProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (colors.length === 0 || disabled) return;

    setExporting(format);
    try {
      switch (format) {
        case 'pdf':
          await exportAsPdf('palette-printable');
          break;
        case 'html':
          exportAsHtml(colors);
          break;
        case 'png':
          await exportAsPng('palette-printable');
          break;
        case 'jpg':
          await exportAsJpg('palette-printable');
          break;
        case 'css':
          exportAsCss(colors);
          break;
        case 'scss':
          exportAsScss(colors);
          break;
        case 'tailwind':
          exportAsTailwind(colors);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const isDisabled = disabled || colors.length === 0;
  const cssPreview = getCodeExportPreview(colors, 'css');
  const scssPreview = getCodeExportPreview(colors, 'scss');
  const tailwindPreview = getCodeExportPreview(colors, 'tailwind');

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Export Palette
      </h3>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Image Exports
          </p>
          <div className="flex flex-wrap gap-3">
            <ExportButton format="pdf" icon={FileText} label="PDF" exporting={exporting} disabled={isDisabled} onExport={handleExport} />
            <ExportButton format="png" icon={FileImage} label="PNG" exporting={exporting} disabled={isDisabled} onExport={handleExport} />
            <ExportButton format="jpg" icon={FileImage} label="JPG" exporting={exporting} disabled={isDisabled} onExport={handleExport} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Code Exports
          </p>
          <div className="grid gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">CSS Variables</span>
                </div>
                <ExportButton format="css" icon={Download} label="Download" exporting={exporting} disabled={isDisabled} onExport={handleExport} />
              </div>
              <pre className="overflow-x-auto bg-gray-50 dark:bg-gray-950/60 p-4 text-xs text-gray-700 dark:text-gray-300">
                <code>{cssPreview}</code>
              </pre>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Braces className="h-4 w-4 text-pink-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">SCSS Variables</span>
                </div>
                <ExportButton format="scss" icon={Download} label="Download" exporting={exporting} disabled={isDisabled} onExport={handleExport} />
              </div>
              <pre className="overflow-x-auto bg-gray-50 dark:bg-gray-950/60 p-4 text-xs text-gray-700 dark:text-gray-300">
                <code>{scssPreview}</code>
              </pre>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-cyan-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Tailwind Config</span>
                </div>
                <ExportButton format="tailwind" icon={Download} label="Download" exporting={exporting} disabled={isDisabled} onExport={handleExport} />
              </div>
              <pre className="overflow-x-auto bg-gray-50 dark:bg-gray-950/60 p-4 text-xs text-gray-700 dark:text-gray-300">
                <code>{tailwindPreview}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {isDisabled && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Extract colors first to enable export options
        </p>
      )}
    </div>
  );
}
