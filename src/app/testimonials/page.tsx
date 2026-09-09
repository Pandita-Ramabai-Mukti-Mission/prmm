import Link from "next/link";
import { getAllTestimonials } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { TestimonialCardView } from "@/components/content-views/TestimonialCardView";

export default function Testimonials() {
  const quotes = getAllTestimonials();

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Testimonials
      </div>
      <h1 className="mt-3 text-4xl">Testimonials</h1>
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
            <TestimonialCardView key={q.slug} quote={q.quote} name={q.name} image={q.image} />
          ))}
        </div>
      )}
    </main>
  );
}
