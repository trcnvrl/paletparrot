'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, UserX } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Formspree'ye bunun bir ayrilma istegi oldugunu belirtiyoruz
    data.subject = "UNSUBSCRIBE REQUEST";
    data.message = "User requested to be removed from all mailing lists.";

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

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <UserX className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Unsubscribe</h1>
          <p className="text-slate-500">
            We're sorry to see you go. Enter your email below to request removal from our mailing lists.
          </p>
        </div>

        <div className="panel p-8">
          {status === 'success' ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Request Received</h3>
                <p className="text-sm text-slate-500">
                  Your request has been sent. We will process it and remove your email from our database shortly.
                </p>
              </div>
              <Link 
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Unsubscribe Me'
                )}
              </button>

              {status === 'error' && (
                <p className="text-xs text-rose-500">
                  Something went wrong. Please try again or contact support.
                </p>
              )}
            </form>
          )}
        </div>

        <p className="text-sm text-slate-400">
          Changed your mind? <Link href="/" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">Go back home</Link>
        </p>
      </div>
    </main>
  );
}
