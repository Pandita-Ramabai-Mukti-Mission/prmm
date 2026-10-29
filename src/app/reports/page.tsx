import Link from "next/link";
import { getAllReports } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { ReportsTable } from "@/components/content-views/ReportsTable";
import { Reveal } from "@/components/Reveal";

// Gap-highlighting (dev-backlog.md #30 — e.g. flagging a missing 2023
// Accounts row) needs a confirmed expected report calendar from the
// client before it can be built without guessing what "missing" means.
// For now this just lists whatever the `reports` collection actually has.
export default function Reports() {
  const reports = getAllReports();

  return (
    <main id="main-content" className="flex-1">
      <section className="bg-[#f3efe7] px-6 py-14 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-sm text-ink-soft">
            <Link href="/">Home</Link> / Reports
          </div>
          <h1 className="mt-3 text-4xl sm:text-5xl">Reports &amp; Transparency</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Audited accounts and trust certificates, published in full.
          </p>
        </div>
      </section>

      <Reveal>
        <div className="px-6 py-14 sm:px-12">
        <div className="mx-auto max-w-6xl">
          {reports.length === 0 ? (
            <EmptyState>Reports are being migrated from the current site.</EmptyState>
          ) : (
            <ReportsTable reports={reports} />
          )}

          <p className="mt-12 text-sm">
            Questions about our legal status or tax exemption?{" "}
            <Link href="/about-mukti-mission/#transparency" className="font-semibold hover:text-coral">
              See our registration &amp; tax details &rarr;
            </Link>
          </p>
        </div>
        </div>
      </Reveal>
    </main>
  );
}
