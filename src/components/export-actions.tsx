'use client';

import { Braces, Check, Copy, Download, FileCode2, FileImage, FileText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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

interface CodeModalState {
  format: Extract<ExportFormat, 'html' | 'css' | 'scss' | 'tailwind'>;
  title: string;
  code: string;
}

interface CodePreviewModalProps {
  modal: CodeModalState;
  exporting: ExportFormat | null;
  onClose: () => void;
  onCopy: () => void;
  onDownload: (format: ExportFormat) => void;
  copied: boolean;
}

function CodePreviewModal({
  modal,
  exporting,
  onClose,
  onCopy,
  onDownload,
  copied,
}: CodePreviewModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-preview-title"
    >
      <div
        className="w-full max-w-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h4 id="code-preview-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {modal.title}
          </h4>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close code preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <pre className="max-h-[60vh] overflow-auto rounded-xl bg-gray-950 p-4 text-xs leading-6 text-gray-100">
            <code>{modal.code}</code>
          </pre>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={onCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => onDownload(modal.format)}
              disabled={exporting !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <Download className="h-4 w-4" />
              {exporting === modal.format ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExportActions({ colors, disabled = false }: ExportActionsProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [codeModal, setCodeModal] = useState<CodeModalState | null>(null);
  const [copied, setCopied] = useState(false);

  const codeExportMeta: Record<Extract<ExportFormat, 'html' | 'css' | 'scss' | 'tailwind'>, { label: string; title: string; icon: React.ElementType }> = {
    html: { label: 'HTML', title: 'HTML', icon: FileText },
    css: { label: 'CSS', title: 'CSS Variables', icon: FileCode2 },
    scss: { label: 'SCSS', title: 'SCSS Variables', icon: Braces },
    tailwind: { label: 'Tailwind', title: 'Tailwind Config', icon: FileCode2 },
  };

  const openCodeModal = (format: Extract<ExportFormat, 'html' | 'css' | 'scss' | 'tailwind'>) => {
    if (colors.length === 0 || disabled) return;

    setCopied(false);
    setCodeModal({
      format,
      title: codeExportMeta[format].title,
      code: getCodeExportPreview(colors, format),
    });
  };

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

  const handleCopy = async () => {
    if (!codeModal) return;

    try {
      await navigator.clipboard.writeText(codeModal.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Copy failed. Please try again.');
    }
  };

  const isDisabled = disabled || colors.length === 0;

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
          <div className="flex flex-wrap gap-3">
            {(
              Object.entries(codeExportMeta) as Array<
                [Extract<ExportFormat, 'html' | 'css' | 'scss' | 'tailwind'>, { label: string; title: string; icon: React.ElementType }]
              >
            ).map(([format, meta]) => (
              <ExportButton
                key={format}
                format={format}
                icon={meta.icon}
                label={meta.label}
                exporting={null}
                disabled={isDisabled}
                onExport={() => openCodeModal(format)}
              />
            ))}
          </div>
        </div>
      </div>

      {isDisabled && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Extract colors first to enable export options
        </p>
      )}

      {codeModal && (
        <CodePreviewModal
          modal={codeModal}
          exporting={exporting}
          onClose={() => setCodeModal(null)}
          onCopy={handleCopy}
          onDownload={handleExport}
          copied={copied}
        />
      )}
    </div>
  );
}
