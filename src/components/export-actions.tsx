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
      className="glass-pill flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-45 dark:text-slate-100"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-preview-title"
    >
      <div
        className="glass-panel w-full max-w-[680px] overflow-hidden rounded-[2rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h4 id="code-preview-title" className="font-display text-xl font-semibold text-slate-950 dark:text-slate-50">
            {modal.title}
          </h4>
          <button
            onClick={onClose}
            className="glass-pill rounded-full p-2 text-slate-600 transition-colors hover:bg-white/18 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
            aria-label="Close code preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <pre className="max-h-[60vh] overflow-auto rounded-[1.5rem] bg-slate-950/90 p-4 text-xs leading-6 text-cyan-50 shadow-inner">
            <code>{modal.code}</code>
          </pre>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={onCopy}
              className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-white/18 dark:text-slate-100"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => onDownload(modal.format)}
              disabled={exporting !== null}
              className="button-sheen inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 54%, #ec4899 100%)',
                boxShadow: '0 20px 48px rgba(99, 102, 241, 0.28)',
              }}
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
    <div className="w-full space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Export
        </p>
        <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-slate-50">
          Export palette
        </h3>
      </div>

      <div className="space-y-5">
        <div className="glass-subpanel rounded-[1.5rem] p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Image files
            </p>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="flex flex-wrap gap-3">
            <ExportButton format="pdf" icon={FileText} label="PDF" exporting={exporting} disabled={isDisabled} onExport={handleExport} />
            <ExportButton format="png" icon={FileImage} label="PNG" exporting={exporting} disabled={isDisabled} onExport={handleExport} />
            <ExportButton format="jpg" icon={FileImage} label="JPG" exporting={exporting} disabled={isDisabled} onExport={handleExport} />
          </div>
        </div>

        <div className="glass-subpanel space-y-3 rounded-[1.5rem] p-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Code files
            </p>
            <div className="h-px flex-1 bg-white/10" />
          </div>
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
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Extract colors first to enable exports.
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
