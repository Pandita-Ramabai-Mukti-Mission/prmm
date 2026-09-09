import Link from "next/link";
import { getAllContacts } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { ContactCardView } from "@/components/content-views/ContactCardView";

export default function Contact() {
  const regions = getAllContacts();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-6 pt-8 sm:px-12">
        <div className="text-sm text-ink-soft">
          <Link href="/">Home</Link> / Contact
        </div>
        <h1 className="mt-3 font-serif text-4xl">Get in Touch</h1>
        <p className="mt-2 max-w-[60ch] text-ink-soft">
          Reach the Kedgaon campus directly, or connect with one of our regional representatives.
        </p>
        <p className="mt-2 text-sm">
          Prefer to give directly?{" "}
          <Link href="/donate/" className="font-semibold hover:text-coral">
            Donate now &rarr;
          </Link>
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 sm:px-12 md:flex-row">
        <div className="flex-1 rounded-lg border border-black/10 bg-white p-6">
          <h2 className="font-serif text-lg">Send a Message</h2>
          <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="rounded-md border border-black/15 px-3.5 py-2.5 text-sm text-ink-soft">
              First name
            </div>
            <div className="rounded-md border border-black/15 px-3.5 py-2.5 text-sm text-ink-soft">
              Last name
            </div>
          </div>
          <div className="mt-3.5 rounded-md border border-black/15 px-3.5 py-2.5 text-sm text-ink-soft">
            Email
          </div>
          <div className="mt-3.5 rounded-md border border-black/15 px-3.5 py-2.5 text-sm text-ink-soft">
            Subject
          </div>
          <div className="mt-3.5 rounded-md border border-black/15 px-3.5 py-7 text-sm text-ink-soft">
            Message
          </div>
          <button
            type="button"
            disabled
            title="Contact-form backend not yet chosen — dev-backlog.md #15"
            className="mt-4 cursor-not-allowed rounded-md bg-coral/60 px-6 py-3 text-sm font-semibold text-white"
          >
            Send Message
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-3.5">
          <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-xs text-[#8a8170]">
            Map — Kedgaon campus
          </div>
          <p className="text-sm text-ink-soft">
            Kedgaon Campus — [full postal address], [phone], [email]. Located ~40km from Pune, accessible
            via Daund Road.
          </p>
        </div>
      </section>

      <section className="bg-[#f3efe7] px-6 py-10 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-xl">Our Regional Representatives</h2>
          {regions.length === 0 ? (
            <div className="mt-5">
              <EmptyState>Regional contact details are being migrated from the current site.</EmptyState>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {regions.map((r) => (
                <ContactCardView
                  key={r.slug}
                  region={r.region}
                  name={r.name}
                  address={r.address}
                  phone={r.phone}
                  email={r.email}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
