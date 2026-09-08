import Link from "next/link";
import { getAllTestimonials } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";

export default function Testimonials() {
  const quotes = getAllTestimonials();

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Testimonials
      </div>
      <h1 className="mt-3 font-serif text-4xl">Testimonials</h1>
      <p className="mt-2 max-w-[60ch] text-ink-soft">
        Voices from residents, alumni and associates whose lives have crossed paths with Mukti Mission.
      </p>

      {quotes.length === 0 ? (
        <div className="mt-8">
          <EmptyState>Testimonials are being migrated from the current site.</EmptyState>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {quotes.map((q) => (
            <div key={q.slug} className="rounded-lg border border-black/10 bg-white p-5">
              <div className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-[9px] text-[#8a8170]">
                {q.image?.alt ?? "Photo"}
              </div>
              <p className="text-sm italic text-ink-soft">&ldquo;{q.quote}&rdquo;</p>
              <div className="mt-3 text-sm font-semibold">{q.name}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
