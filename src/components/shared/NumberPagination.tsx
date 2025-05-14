'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NumberPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., "/practice/A"
  className?: string;
}

export function NumberPagination({
  currentPage,
  totalPages,
  basePath,
  className,
}: NumberPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];
  const maxPagesToShow = 5; // Max number of page links to show (excluding prev/next)
  const halfMaxPages = Math.floor(maxPagesToShow / 2);

  let startPage = Math.max(1, currentPage - halfMaxPages);
  let endPage = Math.min(totalPages, currentPage + halfMaxPages);

  if (currentPage - halfMaxPages < 1) {
    endPage = Math.min(totalPages, maxPagesToShow);
  }
  if (currentPage + halfMaxPages > totalPages) {
    startPage = Math.max(1, totalPages - maxPagesToShow + 1);
  }
  
  if (totalPages > maxPagesToShow) {
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages > maxPagesToShow) {
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
  }
  
  return (
    <nav aria-label="Page navigation" className={cn("flex justify-center items-center space-x-1", className)}>
      {currentPage > 1 && (
        <Button asChild variant="outline" size="icon" className="rounded-md">
          <Link href={`${basePath}/${currentPage - 1}`} aria-label="Go to previous page">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      )}

      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <Button
              asChild
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              className="rounded-md"
            >
              <Link href={`${basePath}/${page}`} aria-current={currentPage === page ? 'page' : undefined}>
                {page}
              </Link>
            </Button>
          ) : (
            <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
          )}
        </React.Fragment>
      ))}

      {currentPage < totalPages && (
        <Button asChild variant="outline" size="icon" className="rounded-md">
          <Link href={`${basePath}/${currentPage + 1}`} aria-label="Go to next page">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </nav>
  );
}

// Need to import React for JSX fragment
import React from 'react';
