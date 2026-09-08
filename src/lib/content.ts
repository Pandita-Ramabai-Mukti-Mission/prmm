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

export type ImageWithAlt = {
  src: string;
  alt: string;
};

export type ProgramMeta = {
  slug: string;
  title: string;
  category: string;
  theme?: string;
  image?: ImageWithAlt;
  description?: string;
};

export type Program = ProgramMeta & { contentHtml: string };

export type NewsMeta = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  image?: ImageWithAlt;
};

export type NewsPost = NewsMeta & { contentHtml: string };

export type GalleryPost = {
  slug: string;
  title: string;
  date: string;
  images: ImageWithAlt[];
  contentHtml: string;
};

export type Report = {
  slug: string;
  title: string;
  year: number;
  type: string;
  file: string;
};

export type Newsletter = {
  slug: string;
  title: string;
  date: string;
  file: string;
};

export type RegionalContact = {
  slug: string;
  region: string;
  name: string;
  address: string;
  phone: string;
  email: string;
};

function readMarkdownFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

async function markdownToHtml(markdown: string) {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

function getSlugsIn(collection: string): string[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllPostSlugs(): string[] {
  return getSlugsIn("posts");
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

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const filePath = path.join(CONTENT_DIR, "pages", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = readMarkdownFile(filePath);
  const contentHtml = await markdownToHtml(content);
  return {
    slug,
    title: data.title ?? slug,
    contentHtml,
  };
}

export function getAllProgramSlugs(): string[] {
  return getSlugsIn("programs");
}

export function getAllProgramsMeta(): ProgramMeta[] {
  return getAllProgramSlugs().map((slug) => {
    const filePath = path.join(CONTENT_DIR, "programs", `${slug}.md`);
    const { data } = readMarkdownFile(filePath);
    return {
      slug,
      title: data.title ?? slug,
      category: data.category,
      theme: data.theme,
      image: data.image,
      description: data.description,
    };
  });
}

export async function getProgramBySlug(slug: string): Promise<Program> {
  const filePath = path.join(CONTENT_DIR, "programs", `${slug}.md`);
  const { data, content } = readMarkdownFile(filePath);
  const contentHtml = await markdownToHtml(content);
  return {
    slug,
    title: data.title ?? slug,
    category: data.category,
    theme: data.theme,
    image: data.image,
    description: data.description,
    contentHtml,
  };
}

export function getAllNewsSlugs(): string[] {
  return getSlugsIn("news");
}

export function getAllNewsMeta(): NewsMeta[] {
  return getAllNewsSlugs()
    .map((slug) => {
      const filePath = path.join(CONTENT_DIR, "news", `${slug}.md`);
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

export async function getNewsBySlug(slug: string): Promise<NewsPost> {
  const filePath = path.join(CONTENT_DIR, "news", `${slug}.md`);
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

export function getAllGallerySlugs(): string[] {
  return getSlugsIn("gallery");
}

export async function getAllGalleryPosts(): Promise<GalleryPost[]> {
  const posts = await Promise.all(
    getAllGallerySlugs().map((slug) => getGalleryPostBySlug(slug))
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getGalleryPostBySlug(slug: string): Promise<GalleryPost> {
  const filePath = path.join(CONTENT_DIR, "gallery", `${slug}.md`);
  const { data, content } = readMarkdownFile(filePath);
  const contentHtml = await markdownToHtml(content);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString() : "",
    images: data.images ?? [],
    contentHtml,
  };
}

export function getAllReports(): Report[] {
  return getSlugsIn("reports")
    .map((slug) => {
      const filePath = path.join(CONTENT_DIR, "reports", `${slug}.md`);
      const { data } = readMarkdownFile(filePath);
      return {
        slug,
        title: data.title ?? slug,
        year: data.year,
        type: data.type,
        file: data.file,
      };
    })
    .sort((a, b) => b.year - a.year);
}

export function getAllNewsletters(): Newsletter[] {
  return getSlugsIn("newsletters")
    .map((slug) => {
      const filePath = path.join(CONTENT_DIR, "newsletters", `${slug}.md`);
      const { data } = readMarkdownFile(filePath);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? new Date(data.date).toISOString() : "",
        file: data.file,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllContacts(): RegionalContact[] {
  return getSlugsIn("contacts").map((slug) => {
    const filePath = path.join(CONTENT_DIR, "contacts", `${slug}.md`);
    const { data } = readMarkdownFile(filePath);
    return {
      slug,
      region: data.region ?? slug,
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
    };
  });
}
