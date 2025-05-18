import MarkdownContent from '@/components/shared/MarkdownContent';
import SeoSchema from '@/components/shared/SeoSchema';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BlogPost, getAllPostSlugs, getPostData } from '@/lib/blog';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { ArrowLeft, CalendarDays, Tag } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Helper function to get the correct image URL, handling both image and coverImage fields
function getImageUrl(post: BlogPost): string {
  const imageField = post.image || post.coverImage || '/images/og-default.png';
  return imageField.startsWith('http') ? imageField : `${SITE_URL}${imageField}`;
}

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // Extract slug early to avoid params.slug access
  const slug = params.slug;
  const post = await getPostData(slug);
  
  if (!post) {
    return {
      title: `Post Not Found | ${SITE_NAME}`,
      description: "The blog post you are looking for could not be found.",
    };
  }
  
  const postUrl = `${SITE_URL}/blog/${params.slug}`;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      // If modifiedTime is available in your frontmatter, add it here
      // modifiedTime: new Date(post.modifiedDate).toISOString(), 
      authors: [SITE_NAME], // Or specific author if available
      images: [
        { 
          url: getImageUrl(post),
          alt: post.title,
          width: 800, // Provide image dimensions if known
          height: 400,
        }
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [getImageUrl(post)], // Ensure absolute URL
       // creator: '@YourTwitterHandle', // Add your Twitter handle
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostData(params.slug);

  if (!post) {
    notFound();
  }

  


  return (
    <>
      <SeoSchema blogPost={post} />
      <div className="container py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">

          {/* Main Content Area */}
          <main className="flex-grow max-w-3xl w-full">
            <article>
              <header className="mb-8">
                <Button asChild variant="ghost" className="mb-6 pl-0 text-primary hover:bg-primary/10">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                  </Link>
                </Button>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-3 border-l-4 border-primary pl-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <CalendarDays className="mr-1.5 h-4 w-4" />
                    <time dateTime={new Date(post.date).toISOString()}>
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-1.5 h-4 w-4" />
                    <span>{post.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-1.5 h-4 w-4" />
                    <span>
                      By {Array.isArray(post.authors)
                        ? post.authors.map((author: any) => author.name).join(', ')
                        : post.authors}
                    </span>
                  </div>
                </div>
                {(post.image || post.coverImage) && (
                  <div className="relative h-64 md:h-80 lg:h-96 w-full rounded-lg overflow-hidden shadow-lg mb-8">
                    <Image 
                      src={getImageUrl(post)} 
                      alt={post.title} 
                      fill 
                      className="object-cover" 
                      priority
                      data-ai-hint={post.dataAiHint || "blog header image"} 
                    />
                  </div>
                )}
              </header>
              <Separator className="my-8" />

              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                           prose-headings:font-semibold prose-headings:tracking-tight
                           prose-headings:border-l-4 prose-headings:border-primary prose-headings:pl-4
                           prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                           prose-img:rounded-md prose-img:shadow-md
                           prose-strong:text-primary"
              >
                <MarkdownContent content={post.content} />
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-8" role="list" aria-label="Tags">
                  <Tag className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Tags:</span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 border border-primary/20 transition-colors shadow-sm"
                      role="listitem"
                      aria-label={`Tag: ${tag}`}
                      rel="tag"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </article>

            <Separator className="my-12" />

            <div className="text-center">
              <Button asChild className="bg-primary hover:bg-primary/90 px-8 py-6">
                  <Link href="/practice">
                    Start Mock Exam Now
                  </Link>
              </Button>
            </div>
          </main>
        </div>


      </div>
    </>
  );
}
