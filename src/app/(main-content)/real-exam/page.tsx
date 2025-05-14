
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ClipboardCheck, Car, Layers, Bike as MotorcycleIcon, TrafficCone } from 'lucide-react'; 
import type { ExamCategoryType } from '@/lib/types';

const pageUrl = `${SITE_URL}/real-exam`;

export const metadata: Metadata = {
  title: `Select Real Exam Category | ${SITE_NAME}`,
  description: `Choose your driving license category (A or B) to start a realistic Likhit exam simulation on ${SITE_NAME}.`,
  keywords: ['Nepal driving license real exam', 'Likhit exam category selection', 'Nepal driving test', 'real exam simulation category', `${SITE_NAME} exam types`, 'bike scooter license', 'car license'],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Select Real Exam Category | ${SITE_NAME}`,
    description: `Choose your driving license category to start a realistic Likhit exam simulation.`,
    url: pageUrl,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Select Real Exam Category | ${SITE_NAME}`,
    description: `Choose your driving license category for a realistic Likhit exam experience.`,
  },
};

interface ExamCategoryDetail {
  type: ExamCategoryType;
  name: string; 
  description: string; 
  icon: React.ElementType;
  href: string;
  comingSoon?: boolean; // Added comingSoon property
}

const ALL_EXAM_CATEGORIES_CONFIG: ExamCategoryDetail[] = [
  {
    type: 'A',
    name: 'Category A (Bike/Scooter)',
    description: 'Practice for your motorcycle and scooter license exam.',
    icon: MotorcycleIcon,
    href: '/real-exam/A'
  },
  {
    type: 'B',
    name: 'Category B (Car/Jeep/Van)',
    description: 'Prepare for car, jeep, or van license exam.', // Removed (Coming Soon) from description as button will handle it
    icon: Car,
    href: '/real-exam/B',
    comingSoon: true, // Mark B as coming soon
  },
  {
    type: 'Traffic',
    name: 'Traffic Signs',
    description: 'Practice questions related to traffic signs.',
    icon: TrafficCone,
    href: '/real-exam/Traffic'
  },
  {
    type: 'Mixed',
    name: 'Mixed Exam (All Categories)',
    description: 'A comprehensive exam covering all vehicle categories.',
    icon: Layers,
    href: '/real-exam/Mixed'
  }
];

const DISPLAYED_EXAM_CATEGORIES_CONFIG = ALL_EXAM_CATEGORIES_CONFIG.filter(
  category => category.type === 'A' || category.type === 'B'
);


export default function SelectRealExamCategoryPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
        <ClipboardCheck className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Choose Your Real Exam Category
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Select the vehicle category for which you want to take the real exam simulation. Each exam consists of 25 questions with a 25-minute time limit.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto">
        {DISPLAYED_EXAM_CATEGORIES_CONFIG.map((category) => (
          <Card key={category.type} className={`flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${category.comingSoon ? 'opacity-70' : ''}`}>
            <CardHeader className="flex-row items-center gap-4 pb-4">
              <category.icon className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{category.description} {category.comingSoon && <span className="text-xs font-medium text-primary">(Coming Soon)</span>}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" disabled={category.comingSoon}>
                <Link href={category.href}>
                  {category.comingSoon ? 'Coming Soon' : 'Start Exam'}
                  {!category.comingSoon && <ArrowRight className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
