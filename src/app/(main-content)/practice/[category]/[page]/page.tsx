import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import type { Question as AppQuestionType } from '@/lib/types';
import { AlertTriangle, FileText } from 'lucide-react'; // Added AlertTriangle
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PracticeTestClient } from '../../PracticeTestClient';

import akQuestionsData from '@/data/ak.json';
import bQuestionsData from '@/data/b-fixed-single-line-corrected.json';
import trafficQuestionsData from '@/data/trafficqn.json'; // Traffic questions data

const QUESTIONS_PER_PAGE = 20;
const VALID_CATEGORIES = ['A', 'B'];


interface PracticeTestPageProps {
  params: { category: string; page: string };
}

function getCategoryDisplayName(categoryCode: string): string {
  const normalizedCategory = categoryCode.toUpperCase();
  if (normalizedCategory === 'A') return 'Category A (Bike/Scooter)';
  if (normalizedCategory === 'B') return 'Category B (Car/Jeep/Van)';
  return `Category ${normalizedCategory}`;
}


export async function generateMetadata({ params }: PracticeTestPageProps): Promise<Metadata> {
  // Use variables instead of accessing params directly multiple times
  const category = params.category.toUpperCase();
  const pageNumber = parseInt(params.page, 10);
  const categoryDisplayName = getCategoryDisplayName(category);

  if (!VALID_CATEGORIES.includes(category) || isNaN(pageNumber) || pageNumber < 1) {
    return {
      title: `Invalid Practice Test Page | ${SITE_NAME}`,
    };
  }

  const pageUrl = `${SITE_URL}/practice/${category}/${pageNumber}`;
  const title = `Practice Test: ${categoryDisplayName} - Page ${pageNumber} | ${SITE_NAME}`;
  const description = `Nepal driving license practice questions for ${categoryDisplayName}, page ${pageNumber}. Prepare for your driving license exam with ${SITE_NAME}.`;

  return {
    title,
    description,
    keywords: [`Nepal driving license ${categoryDisplayName}`, `Driving license exam practice page ${pageNumber}`, `driving test questions ${category}`],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const params: { category: string; page: string }[] = [];
  
  // Access the fixed B category questions directly from the array
  const categoryBQuestions: AppQuestionType[] = (bQuestionsData.questions || [])
    .filter(q => q && q.category === 'B')
    .map(q => ({ ...q, id: q.n, category: 'B' as 'B' }));

  for (const categoryCode of VALID_CATEGORIES) {
    let categoryQuestions: AppQuestionType[] = [];
    const textualQuestions = (akQuestionsData.questions || [])
      .filter(q => {
        if (categoryCode === 'A') return q.category === 'A';
        if (categoryCode === 'B') return q.category === 'B';
        return false;
      })
      .map(q => ({ ...q, id: q.n, category: categoryCode as 'A' | 'B' | 'Traffic' }));

    const allTrafficQuestions = (trafficQuestionsData.questions || [])
      .map(q => ({ ...q, id: q.n, category: 'Traffic' as 'Traffic' }));

    if (categoryCode === 'A') {
      categoryQuestions = [...textualQuestions, ...allTrafficQuestions];
    } else if (categoryCode === 'B') {
      const uniqueBQuestionsMap = new Map();
      
      // Add questions from ak.json
      textualQuestions.forEach(q => {
        uniqueBQuestionsMap.set(q.n as string, { ...q, id: q.n as string, category: 'B' as 'B' });
      });
      
      // Add questions from b-fixed-single-line-corrected.json
      categoryBQuestions.forEach(q => {
        uniqueBQuestionsMap.set(q.n, { ...q, id: q.n, category: 'B' as 'B' });
      });
      
      categoryQuestions = [...Array.from(uniqueBQuestionsMap.values()), ...allTrafficQuestions];
    }

    const totalPages = Math.ceil(categoryQuestions.length / QUESTIONS_PER_PAGE);
    
    if (categoryQuestions.length > 0) {
      // If we have questions, create pages for each chunk
      for (let i = 1; i <= totalPages; i++) {
        params.push({ category: categoryCode, page: i.toString() });
      }
    } else {
      // If we don't have questions, just create a single page
      params.push({ category: categoryCode, page: '1' });
    }
  }
  return params;
}

export default async function PaginatedPracticeTestPage({ params }: PracticeTestPageProps) {
  const category = params.category.toUpperCase();
  const page = parseInt(params.page, 10);

  if (!VALID_CATEGORIES.includes(category) || isNaN(page) || page < 1) {
    notFound();
  }

  let rawTextualQuestions: any[] = (akQuestionsData.questions || []);
  let categoryTextualQuestions: AppQuestionType[];

  if (category === 'A') {
    categoryTextualQuestions = rawTextualQuestions
      .filter(q => q.category === 'A')
      .map(q => ({ ...q, id: q.n, category: 'A' as 'A' }));
  } else if (category === 'B') {
    const bRawQuestions = rawTextualQuestions.filter(q => q.category === 'B');
    const uniqueQuestionsMap = new Map();
    
    // Handle questions from ak.json
    bRawQuestions.forEach(q => {
      uniqueQuestionsMap.set(q.n as string, { ...q, id: q.n as string, category: 'B' as 'B' });
    });
    
    // Handle questions from b-fixed-single-line-corrected.json
    // Now the data has been fixed to be a proper array of question objects
    if (bQuestionsData.questions && Array.isArray(bQuestionsData.questions)) {
      bQuestionsData.questions.forEach(q => {
        // Make sure it's a valid question object with category B
        if (q && typeof q === 'object' && q.category === 'B' && q.n && q.qn && q.a4 && q.an) {
          uniqueQuestionsMap.set(q.n, { ...q, id: q.n, category: 'B' as 'B' });
        }
      });
    }
    
    categoryTextualQuestions = Array.from(uniqueQuestionsMap.values());
  } else {
    notFound();
  }

  const allTrafficQuestions: AppQuestionType[] = (trafficQuestionsData.questions || [])
    .map(q => ({ ...q, id: q.n, category: 'Traffic' as 'Traffic' }));

  // Combine regular questions (pattern questions feature has been removed)
  const allQuestionsForCategory: AppQuestionType[] = [...categoryTextualQuestions, ...allTrafficQuestions];

  const isCategoryBComingSoon = false;

  if (allQuestionsForCategory.length === 0) {
    const message = isCategoryBComingSoon ? "Practice questions for Category B (Car/Jeep/Van) are coming soon. Please check back later or try Category A."
      : "No questions are currently available for this category. Please try another category.";
    return (
      <div className="container py-8 md:py-12 text-center">
        <header className="mb-10 text-center">
          {isCategoryBComingSoon ? <AlertTriangle className="mx-auto h-12 w-12 text-primary mb-4" /> : <FileText className="mx-auto h-12 w-12 text-primary mb-4" />}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Practice Test: {getCategoryDisplayName(category)}
          </h1>
        </header>
        <Alert variant={isCategoryBComingSoon ? "default" : "destructive"} className="max-w-xl mx-auto">
          {isCategoryBComingSoon && <AlertTriangle className="h-4 w-4" />}
          <AlertTitle>{isCategoryBComingSoon ? "Coming Soon!" : "No Questions Available"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link href="/practice">Back to Category Selection</Link>
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(allQuestionsForCategory.length / QUESTIONS_PER_PAGE);
  if (page > totalPages && totalPages > 0) {
    redirect(`/practice/${category}/${totalPages}`);
  }
  if (page > totalPages && totalPages === 0) {
    redirect(`/practice/${category}/1`);
  }

  const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const questionsForCurrentPage = allQuestionsForCategory.slice(startIndex, endIndex);

  if (questionsForCurrentPage.length === 0 && page === 1 && allQuestionsForCategory.length > 0) {
    console.error(`Error: Page 1 for category ${category} has no questions, but total questions exist.`);
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
        <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Practice Test: {getCategoryDisplayName(category)}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Page {page} of {totalPages}. Sharpen your skills with these targeted practice questions.
        </p>
      </header>
      <PracticeTestClient
        questionsForCurrentPage={questionsForCurrentPage}
        currentPage={page}
        totalPages={totalPages}
        category={category}
      />
    </div>
  );
}
