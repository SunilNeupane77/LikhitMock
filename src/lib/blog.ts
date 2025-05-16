import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  coverImage?: string;  // Added coverImage field to match the blog post frontmatter
  dataAiHint?: string;
  category?: string;
  categories?: string[];  // Some posts might use categories array instead of single category
  tags?: string[];
  authors?: {name: string}[] | string;  // Some posts might use a single author string
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: string;
}

export function getSortedPostsData(): BlogPost[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        ...(matterResult.data as BlogPostFrontmatter),
        content: matterResult.content,
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        slug: fileName.replace(/\.md$/, ''),
      };
    });
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      content: matterResult.content,
      ...(matterResult.data as BlogPostFrontmatter),
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}
