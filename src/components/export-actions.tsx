'use client';

import { Download, FileText, FileImage } from 'lucide-react';
import { useState } from 'react';
import type { ExtractedColor, ExportFormat } from '@/lib/types';
import { exportAsPdf, exportAsHtml, exportAsPng, exportAsJpg } from '@/lib/exporters';

interface ExportActionsProps {
  colors: ExtractedColor[];
  disabled?: boolean;
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
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const isDisabled = disabled || colors.length === 0;

  const ExportButton = ({ 
    format, 
    icon: Icon, 
    label 
  }: { 
    format: ExportFormat; 
    icon: React.ElementType; 
    label: string;
  }) => (
    <button
      onClick={() => handleExport(format)}
      disabled={isDisabled || exporting !== null}
      className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      <Icon className="h-4 w-4" />
      {exporting === format ? 'Exporting...' : label}
    </button>
  );

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Export Palette
      </h3>
      
      <div className="flex flex-wrap gap-3">
        <ExportButton format="pdf" icon={FileText} label="PDF" />
        <ExportButton format="html" icon={FileText} label="HTML" />
        <ExportButton format="png" icon={FileImage} label="PNG" />
        <ExportButton format="jpg" icon={FileImage} label="JPG" />
      </div>

      {isDisabled && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Extract colors first to enable export options
        </p>
      )}
    </div>
  );
}
