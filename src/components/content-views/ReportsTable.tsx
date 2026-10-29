export type ReportRowData = { slug: string; title: string; type: string; file: string };

export function ReportsTable({ reports }: { reports: ReportRowData[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((r) => (
        <li key={r.slug}>
          <ReportCard report={r} />
        </li>
      ))}
    </ul>
  );
}

function ReportCard({ report }: { report: ReportRowData }) {
  const body = (
    <>
      <span className="flex h-14 w-11 flex-shrink-0 flex-col items-center justify-end rounded-sm bg-coral/10 pb-1.5 text-coral">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
        <span className="mt-0.5 text-[10px] font-bold tracking-wide">PDF</span>
      </span>
      <span className="min-w-0 flex-1 font-serif text-lg font-semibold leading-snug">
        {report.title}
        {!report.file && <span className="mt-1 block font-sans text-sm font-normal text-ink-soft">(no file uploaded)</span>}
      </span>
    </>
  );
  const cardClass = "flex h-full items-center gap-4 rounded-lg border border-black/10 bg-white p-5 shadow-md";

  return report.file ? (
    <a
      href={report.file}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cardClass} transition-colors hover:border-coral hover:text-coral`}
    >
      {body}
    </a>
  ) : (
    <div className={cardClass}>{body}</div>
  );
}
