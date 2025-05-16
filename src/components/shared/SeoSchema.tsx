
'use client';

import type { BlogPost } from '@/lib/blog';
import { SITE_LOGO_URL, SITE_NAME, SITE_URL } from '@/lib/constants';
import Script from 'next/script';

interface SeoSchemaProps {
  blogPost: BlogPost;
}

const SeoSchema: React.FC<SeoSchemaProps> = ({ blogPost }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${blogPost.slug}`,
    },
    headline: blogPost.title,
    image: [blogPost.image || blogPost.coverImage || SITE_LOGO_URL], // Use image, coverImage, or default
    datePublished: new Date(blogPost.date).toISOString(),
    dateModified: new Date(blogPost.date).toISOString(), // Use a separate modified date if available
    author: {
      '@type': 'Organization', // Or 'Person' if applicable
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO_URL, // Use the constant for logo URL
      },
    },
    description: blogPost.excerpt,
  };

  return (
    <Script
      id="blogpost-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SeoSchema;
