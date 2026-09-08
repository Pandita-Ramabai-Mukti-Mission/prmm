import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import { GetInvolvedBand } from "@/components/GetInvolvedBand";

// History timeline and Leadership are not CMS-managed yet — they resolve
// the "since 1889" vs. Ramabai's 1858-1922 dates confusion from the
// current homepage (docs/site-audit.md) but need a real schema if the
// client wants to edit them without a code change. Flagged, not silently
// assumed.
const TIMELINE = [
  { year: "1889", label: "Mukti Mission founded" },
  { year: "1891", label: "Sharada Sadan opens" },
  { year: "1899", label: "Church cornerstone laid" },
  { year: "1993", label: "Manorama Memorial School opens" },
  { year: "2011", label: "Agape Bible Institute founded" },
  { year: "2020", label: "The Boys Home opens" },
];

const LEADERSHIP = [
  { name: "Mrs. Elizabeth Robert", title: "Leadership" },
  { name: "Dr. Lorraine Francis", title: "Leadership" },
  { name: "Mr. Anil Francis", title: "Leadership" },
];

export default async function AboutMuktiMission() {
  const page = await getPageBySlug("about-mukti-mission");
  if (!page) notFound();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 text-sm text-ink-soft sm:px-12">
        <Link href="/">Home</Link> / About / Mukti Mission
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-12">
        <h1 className="font-serif text-4xl">{page.title}</h1>
        <div
          className="prose mt-4 max-w-[70ch]"
          dangerouslySetInnerHTML={{ __html: page.contentHtml }}
        />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-12">
        <h2 className="mb-5 font-serif text-xl">Our History</h2>
        <div className="relative flex justify-between">
          <div className="absolute left-0 right-0 top-2 h-0.5 bg-black/10" />
          {TIMELINE.map((t) => (
            <div key={t.year} className="relative flex-1 px-2 text-center">
              <div className="relative z-10 mx-auto mb-3 h-4 w-4 rounded-full bg-coral" />
              <div className="text-sm font-bold">{t.year}</div>
              <div className="mt-1 text-xs text-ink-soft">{t.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f3efe7] px-6 py-10 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 font-serif text-xl">Leadership</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {LEADERSHIP.map((l) => (
              <div key={l.name} className="rounded-lg border border-black/10 bg-white p-5 text-center">
                <div className="mx-auto mb-3.5 flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-[10px] text-[#8a8170]">
                  Photo
                </div>
                <h3 className="font-semibold">{l.name}</h3>
                <div className="mb-2 text-sm text-ink-soft">{l.title}</div>
                <p className="text-sm italic text-ink-soft">[1–2 line bio — request from client]</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-black/10 bg-white p-5">
          <div>
            <h3 className="font-semibold">Transparency &amp; Accountability</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Audited accounts, trust certificates and annual reports — see exactly where donations go.
            </p>
          </div>
          <Link
            href="/reports/"
            className="whitespace-nowrap rounded-full bg-slate px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            View Reports &rarr;
          </Link>
        </div>
      </section>

      <GetInvolvedBand />
    </main>
  );
}
