import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { Metadata } from 'next';

const pageUrl = `${SITE_URL}/pattern-examples`;

export const metadata: Metadata = {
  title: `Question Pattern Examples | ${SITE_NAME}`,
  description: `Explore different question patterns that help you better prepare for the Nepali driving license written exam. Practice with multiple choice, matching, sequencing, and true/false questions.`,
  keywords: ['Nepal driving license patterns', 'Likhit exam question formats', 'multiple choice driving test', 'matching questions traffic signs', 'sequence questions driving license'],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Question Pattern Examples | ${SITE_NAME}`,
    description: `Learn about the different question types you might encounter in your driving license written exam.`,
    url: pageUrl,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Question Pattern Examples | ${SITE_NAME}`,
    description: `Prepare effectively with our diverse question patterns for the driving license written exam.`,
  },
};
