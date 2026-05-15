import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - PaletParrot',
  description: 'Read the terms of service and privacy commitment of PaletParrot.',
};

export default function TermsPage() {
  return (
    <main className="flex w-full flex-1 flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl space-y-12">
        <section className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <ShieldCheck className="h-4 w-4 text-[var(--brand-purple)]" />
            Legal & Privacy
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">Terms of Service</h1>
          <p className="text-slate-500">Last updated: May 15, 2026</p>
        </section>

        <section className="panel p-8 sm:p-12 space-y-10 text-slate-700 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Mail className="h-6 w-6 text-[var(--brand-purple)]" />
              1. Newsletter & Communication
            </h2>
            <p>
              By subscribing to our newsletter or pre-registering for the Pro version, you explicitly agree to receive:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Informative emails about PaletParrot's features and usage.</li>
              <li>Product announcements and release updates.</li>
              <li>Occasional surveys to help us improve the tool.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Lock className="h-6 w-6 text-[var(--brand-purple)]" />
              2. Privacy Commitment
            </h2>
            <p className="font-medium text-slate-900 bg-purple-50 p-6 rounded-2xl border border-purple-100">
              We take your privacy seriously. Your email address is stored securely and will NEVER be shared, sold, or traded with third parties, advertisers, or any other external entities under any circumstances.
            </p>
            <p>
              We collect only the minimum information required to provide you with the updates you requested.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-[var(--brand-purple)]" />
              3. User Rights
            </h2>
            <p>
              You maintain full control over your data:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Unsubscribe:</strong> You can opt-out of our communications at any time using the "Unsubscribe" link provided in every email, or via our <Link href="/unsubscribe" className="text-[var(--brand-purple)] hover:underline font-medium">Unsubscribe Request</Link> page.</li>
              <li><strong>Data Deletion:</strong> You can request the complete removal of your email from our systems by contacting us.</li>
            </ul>
          </div>

          <div className="pt-8 border-t border-slate-100 text-sm text-slate-500 italic text-center">
            PaletParrot is an open-source project dedicated to making design and development workflows easier.
          </div>
        </section>
      </div>
    </main>
  );
}
