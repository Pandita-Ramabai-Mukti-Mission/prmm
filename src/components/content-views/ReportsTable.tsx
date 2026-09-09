export type ReportRowData = { slug: string; year: number; type: string; file: string };

export function ReportsTable({ reports }: { reports: ReportRowData[] }) {
  return (
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
              {r.file ? (
                <a href={r.file} className="font-semibold hover:text-coral">
                  Download PDF
                </a>
              ) : (
                <span className="text-ink-soft">(no file uploaded)</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
