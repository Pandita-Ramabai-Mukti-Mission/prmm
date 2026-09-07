import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
};

export type Post = PostMeta & { contentHtml: string };

export type Page = {
  slug: string;
  title: string;
  contentHtml: string;
};

function readMarkdownFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

async function markdownToHtml(markdown: string) {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

export function getAllPostSlugs(): string[] {
  const postsDir = path.join(CONTENT_DIR, "posts");
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const filePath = path.join(CONTENT_DIR, "posts", `${slug}.md`);
      const { data } = readMarkdownFile(filePath);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? new Date(data.date).toISOString() : "",
        description: data.description,
        image: data.image,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(CONTENT_DIR, "posts", `${slug}.md`);
  const { data, content } = readMarkdownFile(filePath);
  const contentHtml = await markdownToHtml(content);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString() : "",
    description: data.description,
    image: data.image,
    contentHtml,
  };
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const filePath = path.join(CONTENT_DIR, "pages", `${slug}.md`);
  const { data, content } = readMarkdownFile(filePath);
  const contentHtml = await markdownToHtml(content);
  return {
    slug,
    title: data.title ?? slug,
    contentHtml,
  };
}
