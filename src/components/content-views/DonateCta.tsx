import Link from "next/link";

export function DonateCta({ programTitle, programSlug }: { programTitle: string; programSlug: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#f0c6c5] bg-[#fbeaea] p-5">
      <div className="font-semibold">Support {programTitle} directly</div>
      <Link
        href={`/donate/?cause=${programSlug}`}
        className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark"
      >
        Donate to This Program &rarr;
      </Link>
    </div>
  );
}
