
import { RealExamClient } from '../RealExamClient';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { ClipboardCheck, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import type { ExamCategoryType, Question as AppQuestionType } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Added Alert components
import { Button } from '@/components/ui/button'; // Added Button
import Link from 'next/link'; // Added Link

import akQuestionsData from '@/data/ak.json';
import trafficQuestionsData from '@/data/trafficqn.json';

const VALID_CATEGORIES: ExamCategoryType[] = ['A', 'B', 'Mixed', 'Traffic']; 

interface RealExamPageProps {
  params: { category: ExamCategoryType };
}

function getCategoryDisplayName(category: ExamCategoryType): string {
  switch (category) {
    case 'A': return 'Category A (Bike/Scooter)';
    case 'B': return 'Category B (Car/Jeep/Van)';
    case 'Traffic': return 'Traffic Signs';
    case 'Mixed': return 'Mixed Exam';
    default: return 'Exam';
  }
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: RealExamPageProps): Promise<Metadata> {
  const { category } = params;

  if (!VALID_CATEGORIES.includes(category)) {
    return {
      title: `Exam Category Not Found | ${SITE_NAME}`,
    }
  }

  const categoryDisplayName = getCategoryDisplayName(category);
  const pageUrl = `${SITE_URL}/real-exam/${category}`;
  const keywords = [
    `Nepal driving license real exam ${categoryDisplayName}`, 
    `Likhit exam ${categoryDisplayName}`, 
    `Nepal driving test ${categoryDisplayName}`, 
    `real exam simulation ${SITE_NAME}`, 
    `practice test ${categoryDisplayName}`,
    ...(category === 'A' ? ['bike license Nepal', 'scooter license Nepal'] : []),
    ...(category === 'B' ? ['car license Nepal'] : [])
  ];


  return {
    title: `Real Exam Simulation - ${categoryDisplayName} | ${SITE_NAME}`,
    description: `Take a timed real exam simulation for ${categoryDisplayName} on ${SITE_NAME}. Test your knowledge under official Nepal driving license Likhit exam conditions. 25 questions, 25 minutes.`,
    keywords: keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `Real Exam - ${categoryDisplayName} | ${SITE_NAME}`,
      description: `Experience the official Likhit exam conditions for ${categoryDisplayName}.`,
      url: pageUrl,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Real Exam - ${categoryDisplayName} | ${SITE_NAME}`,
      description: `Test your preparation for the ${categoryDisplayName} Likhit exam.`,
    },
  };
}

export default async function RealExamCategoryPage({ params }: RealExamPageProps) {
  const { category } = params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  let rawQuestions: any[] = [];

  if (category === 'A' || category === 'B') {
    const textualCategoryQuestions = (akQuestionsData.questions || []).filter(q => q.category === category);
    rawQuestions.push(...textualCategoryQuestions);
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  } else if (category === 'Traffic') {
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  } else if (category === 'Mixed') {
    rawQuestions.push(...(akQuestionsData.questions || [])); 
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  }
  
  const uniqueQuestionsMap = new Map<string, any>();
  rawQuestions.forEach(q => {
    if (q && q.n && !uniqueQuestionsMap.has(q.n)) {
      uniqueQuestionsMap.set(q.n, q);
    }
  });
  
  const allQuestions: AppQuestionType[] = Array.from(uniqueQuestionsMap.values())
    .filter(q => q && q.n && q.category && Array.isArray(q.a4) && q.a4.length > 0 && typeof q.an === 'string')
    .map((q: any) => ({
      id: q.n, 
      n: q.n,
      category: q.category as 'A' | 'B' | 'Traffic', 
      qn: q.qn,
      imageUrl: q.imageUrl,
      a4: q.a4 as string[], 
      an: q.an as string,   
    }));

  const isCategoryBComingSoon = category === 'B' && allQuestions.filter(q => q.category === 'B').length === 0;
  const categoryDisplayName = getCategoryDisplayName(category);

  if (isCategoryBComingSoon && category === 'B') {
    return (
      <div className="container py-8 md:py-12 text-center">
        <header className="mb-10 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Real Exam: {categoryDisplayName}
          </h1>
        </header>
        <Alert variant="default" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Coming Soon!</AlertTitle>
          <AlertDescription>
            Real exam questions for Category B (Car/Jeep/Van) are currently being prepared and will be available soon. Please check back later or try another category.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-8">
          <Link href="/real-exam">Choose Another Category</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container py-8 md:py-12">
        <header className="mb-10 text-center">
            <ClipboardCheck className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Real Exam: {categoryDisplayName}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Test your knowledge under official exam conditions. {REAL_EXAM_QUESTIONS_COUNT} questions, {REAL_EXAM_TIME_LIMIT_SECONDS / 60} minutes.
            </p>
        </header>
        <RealExamClient
            allQuestions={allQuestions} 
            initialCategory={category}
            isCategoryBComingSoon={isCategoryBComingSoon}
        />
    </div>
  );
}

const REAL_EXAM_QUESTIONS_COUNT = 25;
const REAL_EXAM_TIME_LIMIT_SECONDS = 25 * 60;
