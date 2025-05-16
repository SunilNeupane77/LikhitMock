import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  avatarImage?: string;
  avatarFallback: string;
};

export type ResourceLink = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

// Question pattern types for different formats
export type QuestionPatternType = 
  | 'single-choice' // Traditional single-correct-answer
  | 'multiple-choice' // Multiple correct answers
  | 'true-false' // True/False questions
  | 'matching' // Match items from columns
  | 'sequence' // Arrange in correct sequence
  | 'fill-blank'; // Fill in the blank

// New Question type based on ak.json format and trafficqn.json requirements
export type Question = {
  id: string; // Unique identifier, can be same as 'n' or generated
  n: string; // Question number/identifier from source
  category: 'A' | 'B' | 'K' | 'Traffic'; // Category of the question
  qn?: string; // Question text (for text-based questions like A, B)
  imageUrl?: string; // Image URL (for image-based questions like Traffic)
  a4: string[]; // Array of 4 option strings
  an: string; // The correct answer string (must be one of the strings in a4)
  pattern?: QuestionPatternType; // The question pattern type (defaults to single-choice if not specified)
  matchItems?: { left: string; right: string }[]; // For matching questions
  multipleCorrectAnswers?: string[]; // For multiple-choice questions (multiple correct)
  correctSequence?: string[]; // For sequence questions
  blankAnswers?: string[]; // For fill-in-the-blank questions
};

// Traffic Sign type for the /traffic-signs learning page
// Name is now Nepali. Description and category are optional.
export type TrafficSign = {
  id: string;
  name: string; // Nepali name from the new JSON format
  image_url: string;
  description?: string; // Optional: English or Nepali description if available
  category?: string;    // Optional: English or Nepali category if available
};

// Exam Types (Common structure for Real Exam)
export type ExamCategoryType = 'A' | 'B' | 'Mixed' | 'Traffic';

export type MockExamResult = {
  score: number;
  totalQuestions: number;
  date: string; // ISO string
  answers: { questionId: string; selectedOptionIndex: number | null; isCorrect: boolean }[]; // Storing index
  category: ExamCategoryType;
};
