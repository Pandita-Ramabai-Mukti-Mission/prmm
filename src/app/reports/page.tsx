import Link from "next/link";
import { getAllReports } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";

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
        <table className="mt-8 w-full overflow-hidden rounded-lg border border-black/10 bg-white text-sm">
          <thead>
            <tr className="bg-[#f3efe7] text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">File</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.slug} className="border-t border-black/10">
                <td className="px-4 py-3">{r.year}</td>
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3">
                  <a href={r.file} className="font-semibold hover:text-coral">
                    Download PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
