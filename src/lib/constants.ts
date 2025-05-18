
import type { FeatureItem, ExamCategoryType as LibExamCategoryType, NavItem, ResourceLink, Testimonial } from '@/lib/types';
import { BookOpen, Car, ClipboardCheck, FileText, Film, HelpCircle, HelpCircleIcon, Home, ListChecks, Mail, Bike as MotorcycleIcon, Rss, Timer, TrafficCone, TrendingUp, Video } from 'lucide-react';

export const SITE_NAME = "LikhitMock";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
export const SITE_LOGO_URL = `${SITE_URL}${process.env.NEXT_PUBLIC_SITE_LOGO_URL || '/icon-512.png'}`;
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/images/og-default.png`; 

// Navigation Links in English
export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/real-exam", label: "Real Exam", icon: ClipboardCheck },
  { href: "/practice", label: "Practice Test", icon: FileText }, 
  { href: "/traffic-signs", label: "Traffic Signs", icon: TrafficCone },
  { href: "/blog", label: "Blog", icon: Rss },
  { href: "/tutorials", label: "Tutorials", icon: Film },
  { href: "/faq", label: "FAQs", icon: HelpCircle },
  { href: "/contact", label: "Contact Us", icon: Mail },
];

// Feature descriptions translated to English
export const KEY_FEATURES: FeatureItem[] = [
  {
    icon: ListChecks,
    title: "Comprehensive Question Bank",
    description: "Practice questions for vehicle category A (Motorcycle/Scooter) and B (Car/Jeep/Van).",
  },
  {
    icon: TrafficCone,
    title: "Traffic Sign Mastery",
    description: "Interactive traffic sign tutorials with clear visuals and descriptions.",
  },
  {
    icon: Timer,
    title: "Realistic Exam Simulation",
    description: "Timed exams that simulate actual test conditions.",
  },
  {
    icon: TrendingUp,
    title: "Performance Analysis",
    description: "Track your progress and identify areas for improvement.",
  }
];

// Testimonials translated to English
export const TESTIMONIALS_DATA: Testimonial[] = [
   {
    quote: "With the help of this platform, I passed the written exam on my first try! The sample tests were incredibly useful.",
    name: "Sita R.",
    location: "Kathmandu",
    avatarFallback: "SR",
    avatarImage: "https://picsum.photos/seed/sita/100/100",
  },
  {
    quote: "The traffic sign tutorials are excellent. I finally understood all the signs clearly. Highly recommended!",
    name: "Ram K.",
    location: "Pokhara",
    avatarFallback: "RK",
    avatarImage: "https://picsum.photos/seed/ram/100/100",
  },
  {
    quote: "Being able to practice was a game-changer for me. This is the best tool for Likhit preparation.",
    name: "Anjali G.",
    location: "Biratnagar",
    avatarFallback: "AG",
    avatarImage: "https://picsum.photos/seed/anjali/100/100",
  },
];

// Additional Resources translated to English
export const ADDITIONAL_RESOURCES: ResourceLink[] = [
  {
    icon: BookOpen,
    title: "Top 10 Tips to Pass the Likhit Exam",
    description: "Our expert advice to help you pass the written exam.",
    href: "/blog/top-10-tips",
  },
  {
    icon: Video,
    title: "Understanding Nepal's Traffic Signs",
    description: "Detailed video tutorials explaining various traffic signs.",
    href: "/tutorials/traffic-signs-explained",
  },
  {
    icon: HelpCircleIcon,
    title: "Driving License Process FAQs",
    description: "Answers to common questions about obtaining your license.",
    href: "/faq",
  },
];

// Mobile app links removed

export const CONTACT_DETAILS = {
  email: "sunilneupane956@gmail.com",
  address: "Kathmandu, Nepal",
  phone: "N/A"
};

interface ExtendedExamCategoryDetail {
  type: LibExamCategoryType;
  name: string;
  icon: React.ElementType;
  description: string;
  href: string;
  comingSoon?: boolean;
}


// Real Exam Categories - Using English for UI consistency
export const REAL_EXAM_CATEGORIES_CONFIG: ExtendedExamCategoryDetail[] = [
  { 
    type: 'A' as const, 
    name: 'Category A (Bike/Scooter)', 
    icon: MotorcycleIcon, 
    description: 'Practice for your motorcycle and scooter license exam.',
    href: '/real-exam/A'
  },
  { 
    type: 'B' as const, 
    name: 'Category B (Car/Jeep/Van)', 
    icon: Car, 
    description: 'Prepare for car, jeep, or van license exam.',
    href: '/real-exam/B'
  },
];

// Constants for practice test categories
export const PRACTICE_CATEGORIES_CONFIG: {
  type: 'A' | 'B';
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  comingSoon?: boolean;
}[] = [
  {
    type: 'A',
    name: 'Category A (Bike/Scooter)',
    description: 'Comprehensive practice for all Category A (motorcycle, scooter) textual questions and all traffic sign questions.',
    icon: MotorcycleIcon,
    href: '/practice/A/1',
  },
  {
    type: 'B',
    name: 'Category B (Car/Jeep/Van)',
    description: 'Comprehensive practice for all Category B (car, jeep, van) textual questions and all traffic sign questions.',
    icon: Car,
    href: '/practice/B/1',
  },
];
