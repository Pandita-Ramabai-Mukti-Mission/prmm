import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageBySlug } from "@/lib/content";

export default async function PrivacyPolicy() {
  const page = await getPageBySlug("privacy-policy");
  if (!page) notFound();

  return (
    <main id="main-content" className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Privacy Policy
      </div>
      <h1 className="mt-3 font-serif text-3xl">{page.title}</h1>
      <div className="prose mt-5" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
    </main>
  );
}
