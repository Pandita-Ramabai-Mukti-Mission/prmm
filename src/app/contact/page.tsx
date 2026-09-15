import Link from "next/link";
import { getRegionalContacts, getHeadquartersContact } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { RegionalOfficesMap } from "@/components/RegionalOfficesMap";
import { Reveal } from "@/components/Reveal";

export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const { interest } = await searchParams;
  const regions = getRegionalContacts();
  const hq = getHeadquartersContact();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 pt-10 sm:px-12">
        <div className="text-sm text-ink-soft">
          <Link href="/">Home</Link> / Contact
        </div>
        <h1 className="mt-3 text-4xl">Get in Touch</h1>
        <p className="mt-2 max-w-[60ch] text-ink-soft">
          Reach the Kedgaon campus directly, or connect with one of our regional representatives.
        </p>
        {interest === "volunteer" && (
          <p className="mt-3 max-w-[60ch] rounded-md bg-[#e7ecf1] px-4 py-2.5 text-sm text-[#3f5268]">
            Interested in volunteering? Mention that in your message below — there&apos;s no
            separate volunteer form yet, so this reaches the same team.
          </p>
        )}
        <p className="mt-2 text-sm">
          Prefer to give directly?{" "}
          <Link href="/donate/" className="font-semibold hover:text-coral">
            Donate now &rarr;
          </Link>
        </p>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-12 md:flex-row">
        <div className="flex-1 rounded-lg border border-black/10 bg-white shadow-md p-6">
          <h2 className="text-lg">Send a Message</h2>
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
          {/* Real embed (org's own verified PRMM place pin on Google Maps —
              same URL already public on prmm.org.in's own Contact page),
              not a placeholder. No API key needed for this share-style
              embed URL. */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15136.41112641292!2d74.377651!3d18.479003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4e87bb34df8d94e8!2sPandita%20Ramabai%20Mukti%20Mission%20(PRMM)!5e0!3m2!1sen!2sin!4v1576563427397!5m2!1sen!2sin"
            width="100%"
            height="224"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map showing the Pandita Ramabai Mukti Mission campus at Kedgaon"
            className="rounded-lg"
          />
          <div className="rounded-lg border border-black/10 bg-white shadow-md p-5 text-sm text-ink-soft">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Address</div>
            {hq ? (
              <>
                <p className="mt-1 font-semibold text-ink">Pandita Ramabai Mukti Mission (PRMM)</p>
                <p className="mt-1">{hq.address}</p>
                <p className="mt-2">
                  Phone:{" "}
                  <a href={`tel:${hq.phone.replace(/\s+/g, "")}`} className="font-medium text-ink hover:text-coral">
                    {hq.phone}
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${hq.email}`} className="font-medium text-ink hover:text-coral">
                    {hq.email}
                  </a>
                </p>
              </>
            ) : (
              <p className="mt-1">Kedgaon Campus — [headquarters contact not set in CMS]</p>
            )}
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="bg-[#f3efe7] px-6 py-14 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl">Our Regional Representatives</h2>
          {regions.length === 0 ? (
            <div className="mt-5">
              <EmptyState>Regional contact details are being migrated from the current site.</EmptyState>
            </div>
          ) : (
            <div className="mt-5">
              <RegionalOfficesMap regions={regions} />
            </div>
          )}
        </div>
      </section>
      </Reveal>
    </main>
  );
}
