export function NewsletterRow({ title, date, file }: { title: string; date?: string; file?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-4">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-ink-soft">{date && new Date(date).toLocaleDateString()}</div>
      </div>
      {file ? (
        <a href={file} className="text-sm font-semibold hover:text-coral">
          Download PDF &rarr;
        </a>
      ) : (
        <span className="text-sm text-ink-soft">(no file uploaded)</span>
      )}
    </div>
  );
}
