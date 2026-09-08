export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-black/15 bg-white px-6 py-10 text-center text-sm text-ink-soft">
      {children}
    </div>
  );
}
