// The legacy `posts` collection (predates `news`, unlinked from the live
// site — see docs/dev-backlog.md #39). Kept in its own visual style since
// it was never migrated to the rest of the site's design system.
export function PostDetailCore({
  title,
  date,
  body,
}: {
  title: string;
  date?: string;
  body: React.ReactNode;
}) {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">{title}</h1>
      {date && <p className="text-sm text-zinc-500">{new Date(date).toLocaleDateString()}</p>}
      <div className="prose mt-4 dark:prose-invert">{body}</div>
    </>
  );
}
