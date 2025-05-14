
'use client';

import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, strikethrough, etc.)
import type { FC } from 'react';

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: FC<MarkdownContentProps> = ({ content }) => {
  const components: Components = {
    a: ({ node, href, children, ...props }) => {
      // The `props` will include `className` if provided by remark-gfm or other plugins.
      // Tailwind Typography's `prose` classes will style the links.
      if (href && href.startsWith('/')) {
        // Internal link
        return <Link href={href} {...props}>{children}</Link>;
      }
      // External link
      return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
    },
    // Add other customizations if needed, e.g., for images, headings.
    // For now, let Tailwind Typography handle the styling of other elements like h1, h2, h3, p, ul, ol, etc.
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownContent;
