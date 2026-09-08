import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      <a
        href="#main-content"
        className="absolute left-0 top-0 z-50 -translate-y-full rounded-br-md bg-ink px-4 py-2 text-sm text-white transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4 sm:px-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-black/20 bg-paper text-center text-[9px] text-ink-soft">
            LOGO
          </span>
          <span className="text-sm font-bold leading-tight text-ink">
            Pandita Ramabai
            <br />
            Mukti Mission
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink md:flex">
          <Link href="/" className="hover:text-coral">
            Home
          </Link>
          <Link href="/about-mukti-mission/" className="hover:text-coral">
            About
          </Link>
          <Link href="/programs/" className="hover:text-coral">
            Programs
          </Link>
          <Link href="/news/" className="hover:text-coral">
            News
          </Link>
          <Link href="/contact/" className="hover:text-coral">
            Contact
          </Link>
          <Link
            href="/donate/"
            className="rounded-md bg-coral px-5 py-2.5 font-semibold text-white hover:bg-coral-dark"
          >
            Donate
          </Link>
        </nav>
        <Link
          href="/donate/"
          className="rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white md:hidden"
        >
          Donate
        </Link>
      </header>
    </>
  );
}
