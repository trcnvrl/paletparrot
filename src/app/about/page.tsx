import type { Metadata } from 'next';
import Link from 'next/link';
import { Code, Sparkles, Heart } from 'lucide-react';
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
  title: 'About PaletParrot - Open Source Color Extraction',
  description: 'Learn how PaletParrot is solving the color code copy-paste torture for designers and developers. An open-source, completely free color extraction tool.',
};

export default function AboutPage() {
  return (
    <main className="flex w-full flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl space-y-12">
        {/* Header Section */}
        <section className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
            <Heart className="h-4 w-4 text-[var(--brand-red)]" />
            Built for creators
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Ending the copy-paste torture, <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,var(--brand-blue),var(--brand-purple))]">once and for all.</span>
          </h1>
          <p className="text-lg leading-8 text-slate-600 sm:text-xl">
            The endless cycle of taking screenshots, opening them in an editor, picking colors, and manually copying hex codes is a familiar headache. We built PaletParrot to solve this exact problem for designers and developers.
          </p>
        </section>

        {/* Content Section */}
        <section className="panel space-y-8 p-6 sm:p-10 text-slate-700 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">What is PaletParrot?</h2>
            <p>
              PaletParrot is a streamlined, fast, and intuitive tool designed to extract perfect color palettes from any image. We believe that your workflow should be as seamless as possible. Instead of wasting time on repetitive tasks, you should be focusing on what truly matters: creating exceptional designs and building great software.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <Code className="h-6 w-6 text-[var(--brand-blue)]" />
              Proudly Open Source
            </h2>
            <p>
              We firmly believe in the power of community-driven software. That's why PaletParrot is entirely open-source. Anyone is free to download, use, inspect, or actively develop it. Whether you want to add a new export format or tweak the extraction algorithm, your contributions are welcome.
            </p>
            <p className="pt-2">
              <a 
                href="https://github.com/trcnvrl/paletparrot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-[var(--brand-blue)] hover:text-blue-700 transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
                View the project on GitHub
              </a>
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Always Free, Always Yours</h2>
            <p>
              We want to be transparent about our pricing philosophy: <strong>This beta version of PaletParrot will remain completely free forever.</strong> There are no hidden fees, no required registrations, and no restrictive limits on the features you see today.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 p-6 sm:p-8 border border-purple-100">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-[var(--brand-purple)]" />
              The Future: AI & Pro Features
            </h2>
            <p>
              While the current product will always be free, we are actively developing a highly advanced version with more powerful features and deep AI integration. This upcoming release will handle complex design systems, intelligent color matching, and even more sophisticated export capabilities.
            </p>
            <p className="pt-4 font-medium text-slate-900">
              Interested in being the first to know? Sign up at{' '}
              <a href="https://paletparrot.com" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-purple)] hover:text-purple-700 transition-colors underline decoration-purple-200 underline-offset-4">
                paletparrot.com
              </a>{' '}
              to get notified and benefit from the next generation of color extraction.
            </p>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mx-auto max-w-xl text-center space-y-6 pt-12 border-t border-slate-200/60">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">Stay in the Loop 🦜</h3>
            <p className="text-slate-500">
              Get notified about the Pro version release and open-source updates.
            </p>
          </div>
          <NewsletterForm />
        </section>
      </div>
    </main>
  );
}
