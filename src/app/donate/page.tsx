import Link from "next/link";
import { getAllProgramsMeta } from "@/lib/content";
import { DonateForm } from "./DonateForm";

export default async function Donate({
  searchParams,
}: {
  searchParams: Promise<{ cause?: string }>;
}) {
  const { cause } = await searchParams;
  const causes = getAllProgramsMeta().map((p) => ({ slug: p.slug, title: p.title }));

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Donate
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <span className="rounded-full bg-[#e7ecf1] px-3 py-1 text-xs font-semibold text-[#3f5268]">
          80G Tax Exempt
        </span>
        <span className="rounded-full bg-[#e7ecf1] px-3 py-1 text-xs font-semibold text-[#3f5268]">
          Registered Public Trust (1950 Act)
        </span>
        <span className="rounded-full bg-[#e7ecf1] px-3 py-1 text-xs font-semibold text-[#3f5268]">
          Secure Payment
        </span>
        <span className="rounded-full bg-[#f4ead4] px-3 py-1 text-xs font-semibold italic text-[#8f6a0a]">
          [Payment partner — gateway pending selection, see docs/dev-backlog.md #13]
        </span>
      </div>

      <div className="mt-6">
        <DonateForm causes={causes} initialCause={cause} />
      </div>
    </main>
  );
}
