
import { SITE_NAME } from '@/lib/constants';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

interface PracticeCategoryRedirectPageProps {
  params: { category: string };
}

function getCategoryDisplayName(categoryCode: string): string {
  const normalizedCategory = categoryCode.toUpperCase();
  if (normalizedCategory === 'A') return 'Category A (Bike/Scooter)';
  if (normalizedCategory === 'B') return 'Category B (Car/Jeep/Van)';
  return `Category ${normalizedCategory}`;
}

export async function generateMetadata({ params }: PracticeCategoryRedirectPageProps): Promise<Metadata> {
  // Extract category early to avoid using params.category directly
  const category = params.category;
  const categoryDisplayName = getCategoryDisplayName(category);
  
  return {
    title: `Loading Practice Test - ${categoryDisplayName} | ${SITE_NAME}`,
    robots: {
      index: false, // No need to index redirect pages
      follow: true,
    },
  };
}

export default function PracticeCategoryRedirectPage({ params }: PracticeCategoryRedirectPageProps) {
  const { category } = params;
  // Basic validation, more robust validation can be added
  const validCategories = ['A', 'B'];
  const normalizedCategory = category.toUpperCase();

  if (!validCategories.includes(normalizedCategory)) {
    redirect('/practice'); // Redirect to category selection if invalid
    return null;
  }
  
  redirect(`/practice/${normalizedCategory}/1`); // Redirect to the first page
  return null; // Or a loading spinner component
}

export async function generateStaticParams() {
  const categories = ['A', 'B'];
  return categories.map((cat) => ({
    category: cat,
  }));
}
