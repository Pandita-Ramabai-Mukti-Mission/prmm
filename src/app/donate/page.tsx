import Link from "next/link";
import { getAllProgramsMeta } from "@/lib/content";
import { DonateForm } from "./DonateForm";
import { Reveal } from "@/components/Reveal";

export default async function Donate({
  searchParams,
}: {
  searchParams: Promise<{ cause?: string }>;
}) {
  const { cause } = await searchParams;
  const causes = getAllProgramsMeta().map((p) => ({
    slug: p.slug,
    title: p.title,
    donateVerb: p.donateVerb,
  }));

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Donate
      </div>
      <h1 className="mt-3 text-3xl">Donate</h1>

      <Reveal>
      <div className="mt-5 flex flex-wrap gap-3">
        <span className="rounded-full bg-[#e7ecf1] px-3 py-1 text-xs font-semibold text-[#3f5268]">
          80G Tax Exempt
        </span>
        <span className="rounded-full bg-[#e7ecf1] px-3 py-1 text-xs font-semibold text-[#3f5268]">
          Registered Public Trust (1950 Act)
        </span>
        <span className="rounded-full bg-[#e7ecf1] px-3 py-1 text-xs font-semibold text-[#3f5268]">
          Secure Payment
        </span>
        <span className="rounded-full bg-[#e7ecf1] px-3 py-1 text-xs font-semibold text-[#3f5268]">
          Payments via PayU
        </span>
      </div>
      </Reveal>

      <Reveal>
      <div className="mt-8">
        <DonateForm causes={causes} initialCause={cause} />
      </div>
      </Reveal>
    </main>
  );
}
