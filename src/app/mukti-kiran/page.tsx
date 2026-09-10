import Link from "next/link";
import { getAllNewsletters } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { NewsletterRow } from "@/components/content-views/NewsletterRow";
import { Reveal } from "@/components/Reveal";

export default function Newsletters() {
  const issues = getAllNewsletters();

  return (
    <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-6 py-14 sm:px-12">
      {/* Retention loop, not the linear story→trust→ask funnel: keeps a
          not-yet-donor visitor connected until a future ask lands better —
          see the user-journey review in today's session notes. */}
      <Reveal>
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Mukti Kiran
      </div>
      <h1 className="mt-3 text-4xl">Mukti Kiran Newsletter</h1>
      <p className="mt-2 text-ink-soft">Our quarterly newsletter and prayer updates, archived by issue.</p>

      <div className="mt-8 flex gap-3">
        <div className="flex-1 rounded-md border border-black/15 px-3.5 py-2.5 text-sm text-ink-soft">
          Email address
        </div>
        <button
          type="button"
          disabled
          title="Newsletter ESP not yet chosen — dev-backlog.md #16"
          className="cursor-not-allowed rounded-md bg-coral/60 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Subscribe
        </button>
      </div>

      <h2 className="mt-8 mb-3 text-lg">Archive</h2>
      {issues.length === 0 ? (
        <EmptyState>Back issues are being migrated from the current site.</EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {issues.map((i) => (
            <NewsletterRow key={i.slug} title={i.title} date={i.date} file={i.file} />
          ))}
        </div>
      )}
      </Reveal>
    </main>
  );
}
