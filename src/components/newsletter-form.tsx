'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, X, ShieldCheck } from 'lucide-react';

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Checkbox isareti bilgisini Formspree'ye gonderilecek dataya ekliyoruz
    data.newsletter_subscription = agreed ? "Yes (Marketing + Updates)" : "No (Only Product Updates)";

    try {
      const response = await fetch("https://formspree.io/f/xkoylaon", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-4 animate-in fade-in zoom-in duration-500">
        <div className="rounded-full bg-green-50 p-3 text-green-600 ring-4 ring-green-50/50">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900">You're on the list! 🚀</p>
          <p className="text-xs text-slate-500">We'll notify you as soon as the Pro version is ready.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[var(--brand-purple)] focus:ring-[var(--brand-purple)] cursor-pointer"
          />
          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
            Sign up for PaletParrot newsletter
          </span>
        </label>
        <p className="text-[10px] text-slate-400">
          By checking this box, you agree to our{' '}
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-[var(--brand-purple)] underline decoration-purple-200 underline-offset-2 hover:text-purple-700"
          >
            Terms
          </button>
        </p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
          disabled={status === 'loading'}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--brand-purple)] hover:shadow-lg hover:shadow-[var(--brand-purple)]/25 active:scale-[0.98] sm:w-auto whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Notify Me'
          )}
        </button>
      </form>

      {/* Terms Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3 text-[var(--brand-purple)]">
              <div className="bg-purple-50 p-2 rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Terms of Service</h2>
            </div>

            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                By subscribing to our updates, you agree to receive informative emails, product announcements, and development updates from PaletParrot.
              </p>
              <p className="font-medium text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                Privacy Promise: Your email address is safe with us. We will NEVER share, sell, or trade your personal information with 3rd parties under any circumstances.
              </p>
              <p>
                You can unsubscribe at any time by clicking the link in the footer of our emails.
              </p>
            </div>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
      {status === 'error' && (
        <p className="text-xs text-rose-500 animate-in fade-in slide-in-from-top-1">
          Something went wrong. Please try again or check your email.
        </p>
      )}
    </div>
  );
}
