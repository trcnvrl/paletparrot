'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/18 dark:text-slate-100"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
