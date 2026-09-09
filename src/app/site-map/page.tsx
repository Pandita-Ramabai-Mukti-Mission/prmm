import Link from "next/link";
import { getAllProgramsMeta, getAllNewsMeta, getAllGalleryMeta } from "@/lib/content";

// Generated from the real content collections at build time, not
// hand-maintained — the current site's sitemap is already out of sync
// (missing all 14 Impact projects and the gallery posts, per
// docs/site-audit.md). Static structural pages (About, Legal, etc. — one
// per route, not a collection) are still listed by hand below since
// there's no data source to generate them from; only the parts backed by
// a content collection are pulled dynamically.
export default function Sitemap() {
  const programs = getAllProgramsMeta();
  const news = getAllNewsMeta();
  const gallery = getAllGalleryMeta();

  return (
    <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Sitemap
      </div>
      <h1 className="mt-3 font-serif text-3xl">Sitemap</h1>

      <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
        <SitemapColumn title="About">
          <SitemapLink href="/about-pandita-ramabai/">About Pandita Ramabai</SitemapLink>
          <SitemapLink href="/about-mukti-mission/">About Mukti Mission</SitemapLink>
          <SitemapLink href="/reach/">Where We Work</SitemapLink>
          <SitemapLink href="/reports/">Reports &amp; Transparency</SitemapLink>
          <SitemapLink href="/testimonials/">Testimonials</SitemapLink>
        </SitemapColumn>
        <SitemapColumn title={`Programs (${programs.length})`}>
          <SitemapLink href="/programs/">View all programs</SitemapLink>
          <SitemapLink href="/shaping-the-mind/">Shaping the Mind</SitemapLink>
          <SitemapLink href="/shaping-the-spirit/">Shaping the Spirit</SitemapLink>
          <SitemapLink href="/shaping-the-heart/">Shaping the Heart</SitemapLink>
          <SitemapLink href="/shaping-the-environment/">Shaping the Environment</SitemapLink>
          <SitemapLink href="/shaping-the-destiny/">Shaping the Destiny</SitemapLink>
          {programs.map((p) => (
            <SitemapLink key={p.slug} href={`/programs/${p.slug}/`}>
              {p.title}
            </SitemapLink>
          ))}
        </SitemapColumn>
        <SitemapColumn title={`News & Media (${news.length + gallery.length})`}>
          <SitemapLink href="/news/">News &amp; Updates</SitemapLink>
          {news.map((n) => (
            <SitemapLink key={n.slug} href={`/news/${n.slug}/`}>
              {n.title}
            </SitemapLink>
          ))}
          <SitemapLink href="/happenings-at-mukti/">Happenings at Mukti</SitemapLink>
          {gallery.map((g) => (
            <SitemapLink key={g.slug} href={`/happenings-at-mukti/${g.slug}/`}>
              {g.title}
            </SitemapLink>
          ))}
          <SitemapLink href="/mukti-kiran/">Mukti Kiran Newsletter</SitemapLink>
        </SitemapColumn>
        <SitemapColumn title="Get Involved / Legal">
          <SitemapLink href="/donate/">Donate</SitemapLink>
          <SitemapLink href="/contact/">Contact Us</SitemapLink>
          <SitemapLink href="/terms-of-use/">Terms of Use</SitemapLink>
          <SitemapLink href="/privacy-policy/">Privacy Policy</SitemapLink>
        </SitemapColumn>
      </div>
    </main>
  );
}

function SitemapColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">{title}</h3>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function SitemapLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm hover:text-coral">
        {children}
      </Link>
    </li>
  );
}
