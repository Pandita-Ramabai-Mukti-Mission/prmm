import Link from "next/link";
import { getAllReports } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { ReportsTable } from "@/components/content-views/ReportsTable";

// Gap-highlighting (dev-backlog.md #30 — e.g. flagging a missing 2023
// Accounts row) needs a confirmed expected report calendar from the
// client before it can be built without guessing what "missing" means.
// For now this just lists whatever the `reports` collection actually has.
export default function Reports() {
  const reports = getAllReports();

  return (
    <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Reports
      </div>
      <h1 className="mt-3 font-serif text-4xl">Reports &amp; Transparency</h1>
      <p className="mt-2 text-ink-soft">Audited accounts and trust certificates, published in full.</p>

      {reports.length === 0 ? (
        <div className="mt-8">
          <EmptyState>Reports are being migrated from the current site.</EmptyState>
        </div>
      ) : (
        <ReportsTable reports={reports} />
      )}
    </main>
  );
}
