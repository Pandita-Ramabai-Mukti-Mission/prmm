import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageBySlug, getRegionalContacts, getReachExtras } from "@/lib/content";
import { PageTitleBody } from "@/components/content-views/PageTitleBody";
import { WhereWeWorkMap } from "@/components/WhereWeWorkMap";
import { RegionalOfficesMap } from "@/components/RegionalOfficesMap";
import { Reveal } from "@/components/Reveal";

export default async function WhereWeWork() {
  const page = await getPageBySlug("reach");
  if (!page) notFound();

  const contacts = getRegionalContacts();
  const { mapImage } = getReachExtras();

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-12">
      <Reveal>
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Where We Work
      </div>
      <PageTitleBody
        title={page.title}
        headingClassName="mt-3 text-4xl"
        bodyClassName="prose mt-3 max-w-[70ch]"
        body={<div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />}
      />

      {mapImage?.src ? (
        <div className="mt-10">
          <WhereWeWorkMap mapSrc={mapImage.src} mapAlt={mapImage.alt} />
        </div>
      ) : (
        <div className="mt-10 flex h-64 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-xs text-[#8a8170] sm:h-96">
          Map of India — locations
        </div>
      )}
      </Reveal>

      <Reveal>
      <div className="mt-10 rounded-lg border border-black/10 bg-white shadow-md p-5">
        <div className="text-sm font-semibold">Kedgaon Campus</div>
        <div className="mt-1 text-sm text-ink-soft">Founding campus &amp; headquarters</div>
      </div>

      <h2 className="mt-10 text-xl">Our Regional Representatives</h2>
      <div className="mt-5">
        <RegionalOfficesMap regions={contacts} />
      </div>

      <p className="mt-8 text-sm">
        Don&rsquo;t see a representative near you?{" "}
        <Link href="/contact/" className="font-semibold hover:text-coral">
          Get in touch &rarr;
        </Link>{" "}
        or{" "}
        <Link href="/contact/?interest=volunteer" className="font-semibold hover:text-coral">
          reach out about volunteering in your region &rarr;
        </Link>
      </p>
      </Reveal>
    </main>
  );
}
