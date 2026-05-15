import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Heart, Zap, Sparkles, ShieldCheck, Globe, Rocket } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter-form';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 2 11.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
      <path d="M9 18c-4.5 1.5-5-2-7-2" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: 'Pricing - PaletParrot',
  description: 'PaletParrot is lifetime free, unlimited, and requires no registration. Open source color extraction tool.',
};

export default function PricingPage() {
  return (
    <main className="flex w-full flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
            <Heart className="h-4 w-4 text-[var(--brand-red)]" />
            No credit card required
          </div>
          
          <h1 className="font-display text-5xl font-bold leading-tight text-transparent bg-clip-text bg-[linear-gradient(135deg,var(--brand-purple),var(--brand-blue),var(--brand-red))] sm:text-7xl lg:text-8xl">
            Lifetime Free
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            PaletParrot is an open-source project. This beta version is completely free for life, fully unlimited, and you don't even need to register to use it.
          </p>
        </section>

        {/* Pricing Cards Grid */}
        <section className="grid gap-8 lg:grid-cols-2 lg:items-stretch max-w-5xl mx-auto w-full">
          
          {/* Community Edition Card */}
          <div className="panel p-8 sm:p-10 relative overflow-hidden group border border-slate-200 flex flex-col h-full transition-all hover:border-slate-300">
            <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-32 h-32 text-slate-400" />
            </div>
            
            <div className="space-y-6 relative z-10 flex flex-col h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-4">
                  Community
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Community Edition</h3>
                <p className="mt-2 text-slate-500 text-sm">Everything you need for essential color work.</p>
              </div>
              
              <div className="flex items-baseline text-4xl font-bold text-slate-900">
                Free
                <span className="ml-2 text-sm font-medium text-slate-500 italic">forever</span>
              </div>

              <ul className="space-y-3 pt-6 border-t border-slate-100 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand-blue)] flex-shrink-0" />
                  <span>Unlimited palette extractions</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand-blue)] flex-shrink-0" />
                  <span>Basic naming & labeling</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand-blue)] flex-shrink-0" />
                  <span>Export to CSS, SCSS, & Tailwind</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand-blue)] flex-shrink-0" />
                  <span>No account required</span>
                </li>
              </ul>
              
              <div className="pt-8 mt-auto">
                <Link 
                  href="/" 
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-50 active:scale-[0.98]"
                >
                  Start using now
                </Link>
              </div>
            </div>
          </div>

          {/* Pro Edition Card */}
          <div className="panel p-8 sm:p-10 relative overflow-hidden group border-2 border-[var(--brand-purple)] bg-gradient-to-br from-white to-purple-50/30 flex flex-col h-full shadow-xl shadow-purple-900/5">
            <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-32 h-32 text-[var(--brand-purple)]" />
            </div>
            
            <div className="space-y-6 relative z-10 flex flex-col h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-purple)] mb-4">
                  Upcoming
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Pro Edition</h3>
                <p className="mt-2 text-slate-500 text-sm">Professional tools for design systems & brand teams.</p>
              </div>
              
              <div className="flex items-baseline text-4xl font-bold text-[var(--brand-purple)]">
                Coming Soon
              </div>

              <ul className="space-y-3 pt-6 border-t border-purple-100 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <Rocket className="h-5 w-5 text-[var(--brand-purple)] flex-shrink-0" />
                  <span>AI-Powered Palette Harmony</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <ShieldCheck className="h-5 w-5 text-[var(--brand-purple)] flex-shrink-0" />
                  <span>WCAG 2.1 Contrast Auditing</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Globe className="h-5 w-5 text-[var(--brand-purple)] flex-shrink-0" />
                  <span>Project Workspaces & Folders</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Zap className="h-5 w-5 text-[var(--brand-purple)] flex-shrink-0" />
                  <span>Adobe Swatch (ASE) & Figma Export</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700 italic">
                  <Sparkles className="h-5 w-5 text-[var(--brand-purple)] flex-shrink-0" />
                  <span>Cloud Sync & Team Sharing</span>
                </li>
              </ul>
              
              <div className="pt-8 mt-auto">
                <button 
                  disabled
                  className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white cursor-not-allowed opacity-90"
                >
                  Join Waitlist Below
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Upcoming Pro version note & Email Capture */}
        <section className="mx-auto max-w-xl text-center space-y-6 pt-12">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">Get Notified for Pro 🚀</h3>
            <p className="text-slate-500">
              Need more advanced features? A Pro version with AI support is coming soon. Enter your email to get early access and pre-registration perks.
            </p>
          </div>
          
          <NewsletterForm />
          <p className="text-xs text-slate-400">
            No spam, ever. Unsubscribe at any time.
          </p>
        </section>

      </div>
    </main>
  );
}
