import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageBySlug } from "@/lib/content";
import { PageTitleBody } from "@/components/content-views/PageTitleBody";

export default async function PrivacyPolicy() {
  const page = await getPageBySlug("privacy-policy");
  if (!page) notFound();

  return (
    <main id="main-content" className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Privacy Policy
      </div>
      <PageTitleBody
        title={page.title}
        bodyClassName="prose mt-5"
        body={<div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />}
      />
    </main>
  );
}
