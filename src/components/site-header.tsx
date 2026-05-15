import Image from 'next/image';
import Link from 'next/link';

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

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/92 backdrop-blur-md">
      <div className="flex w-full items-center px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-1 justify-start">
          <Link href="/">
            <Image
              src="/logo-header.png"
              alt="PaletParrot"
              width={400}
              height={100}
              className="h-12 w-auto sm:h-[58px] md:h-[68px]"
              priority
            />
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-center gap-6 sm:gap-8">
          <Link href="/about" className="text-sm font-semibold text-slate-600 transition-colors hover:text-[var(--brand-blue)]">
            About
          </Link>
          <Link href="/pricing" className="text-sm font-semibold text-slate-600 transition-colors hover:text-[var(--brand-purple)]">
            Pricing
          </Link>
        </nav>
        <div className="flex flex-1 justify-end">
          <a href="https://github.com/trcnvrl/paletparrot" target="_blank" rel="noopener noreferrer" className="text-slate-600 transition-colors hover:text-[var(--brand-red)] p-1">
            <GithubIcon className="h-6 w-6" />
          </a>
        </div>
      </div>
    </header>
  );
}
