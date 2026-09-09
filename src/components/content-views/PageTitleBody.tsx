// Shared by the simple "pages" collection routes (Terms of Use, Privacy
// Policy, Where We Work, About Pandita Ramabai) and the CMS preview for
// the `pages` collection. Home and About Mukti Mission have bespoke hero
// layouts around their title/body and aren't forced into this — see
// docs/dev-backlog.md on the `pages` collection only covering a slice of
// some pages.
export function PageTitleBody({
  title,
  body,
  headingClassName = "mt-3 text-3xl",
  bodyClassName = "prose mt-5 max-w-none",
}: {
  title: string;
  body: React.ReactNode;
  headingClassName?: string;
  bodyClassName?: string;
}) {
  return (
    <>
      <h1 className={headingClassName}>{title}</h1>
      <div className={bodyClassName}>{body}</div>
    </>
  );
}
