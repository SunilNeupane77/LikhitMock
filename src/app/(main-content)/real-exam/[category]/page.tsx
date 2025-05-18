
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import type { Question as AppQuestionType, ExamCategoryType } from '@/lib/types';
import { ClipboardCheck } from 'lucide-react'; // Added AlertTriangle
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RealExamClient } from '../RealExamClient';

import akQuestionsData from '@/data/ak.json';
import bQuestionsData from '@/data/b-fixed-single-line-corrected.json';
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
  // Pre-define all valid categories to ensure proper static generation
  return VALID_CATEGORIES.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: RealExamPageProps): Promise<Metadata> {
  // Use the category as a variable directly after awaiting params
  const category = (await params).category as ExamCategoryType;

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
  const category = (await params).category as ExamCategoryType;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  let rawQuestions: any[] = [];

  if (category === 'A' || category === 'B') {
    // Add questions from akQuestionsData that match the category
    const categoryQuestions = (akQuestionsData.questions || []).filter(q => q.category === category);
    rawQuestions.push(...categoryQuestions);
    
    // If category is B, also add questions from bQuestionsData
    if (category === 'B') {
      const bQuestions = (bQuestionsData.questions || []).filter(q => q.category === 'B');
      rawQuestions.push(...bQuestions);
    }
    
    // Add traffic questions
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  } else if (category === 'Traffic') {
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  } else if (category === 'Mixed') {
    // For mixed category, include both A and B
    const aQuestions = (akQuestionsData.questions || []).filter(q => q.category === 'A');
    rawQuestions.push(...aQuestions);
    
    // Get B questions from both sources
    const bRawQuestions = (akQuestionsData.questions || []).filter(q => q.category === 'B');
    rawQuestions.push(...bRawQuestions);
    
    const bFixedQuestions = (bQuestionsData.questions || []).filter(q => q.category === 'B');
    rawQuestions.push(...bFixedQuestions);
    
    // Add traffic questions
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  }
  
  // Create a Map to store unique questions by their ID
  const uniqueQuestionsMap = new Map<string, any>();
  rawQuestions.forEach(q => {
    if (q && typeof q === 'object' && 'n' in q && !uniqueQuestionsMap.has(q.n)) {
      uniqueQuestionsMap.set(q.n, q);
    }
  });
  
  // Convert standard questions
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

  // Set isCategoryBComingSoon to false since we now have B questions
  const isCategoryBComingSoon = false;
  const categoryDisplayName = getCategoryDisplayName(category);


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
