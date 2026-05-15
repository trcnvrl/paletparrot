import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white/40 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left order-2 sm:order-1">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} PaletParrot</p>
        </div>
        
        <div className="flex justify-center order-1 sm:order-2">
          <Link href="/terms" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-200 underline-offset-4">
            Terms of Service
          </Link>
        </div>

        <div className="flex justify-center sm:justify-end order-3">
          <a 
            href="https://creativiawebagency.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            by <span style={{ color: '#FE5000' }} className="font-bold tracking-tight">CREATIVIA</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
