import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageBySlug, getAllContacts } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";

export default async function WhereWeWork() {
  const page = await getPageBySlug("reach");
  if (!page) notFound();

  const contacts = getAllContacts();

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Where We Work
      </div>
      <h1 className="mt-3 font-serif text-4xl">{page.title}</h1>
      <div className="prose mt-3 max-w-[70ch]" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />

      <div className="mt-8 flex h-64 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-xs text-[#8a8170]">
        Map of India — locations
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-4">
          <div className="text-sm font-semibold">Kedgaon Campus</div>
          <div className="mt-1 text-sm text-ink-soft">Founding campus &amp; headquarters</div>
        </div>
        {contacts.length === 0 ? (
          <div className="col-span-2">
            <EmptyState>Regional locations are being migrated from the current site.</EmptyState>
          </div>
        ) : (
          contacts.map((c) => (
            <div key={c.slug} className="rounded-lg border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold">{c.region}</div>
              <div className="mt-1 text-sm text-ink-soft">Regional representative</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
