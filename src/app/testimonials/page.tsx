import Link from "next/link";
import { getAllTestimonials } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { TestimonialCardView } from "@/components/content-views/TestimonialCardView";
import { WovenThreadsMotif } from "@/components/WovenThreadsMotif";
import { Reveal } from "@/components/Reveal";

export default function Testimonials() {
  const quotes = getAllTestimonials();

  return (
    <main id="main-content" className="relative mx-auto w-full max-w-6xl flex-1 overflow-hidden px-6 py-14 sm:px-12">
      {/* This page's one decorative motif — see WovenThreadsMotif.tsx */}
      <WovenThreadsMotif className="pointer-events-none absolute right-6 top-8 hidden h-24 w-56 text-[#8f6a0a]/[0.16] sm:block" />
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Testimonials
      </div>
      <h1 className="mt-3 text-4xl">Testimonials</h1>
      <p className="mt-2 max-w-[60ch] text-ink-soft">
        Voices from residents, alumni and associates whose lives have crossed paths with Mukti Mission.
      </p>

      <Reveal>
      {quotes.length === 0 ? (
        <div className="mt-8">
          <EmptyState>Testimonials are being migrated from the current site.</EmptyState>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-3">
          {quotes.map((q) => (
            <TestimonialCardView key={q.slug} quote={q.quote} name={q.name} image={q.image} />
          ))}
        </div>
      )}
      </Reveal>
    </main>
  );
}
