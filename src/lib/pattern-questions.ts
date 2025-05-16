import type { Question } from '@/lib/types';
import fs from 'fs';
import path from 'path';

// Function to load pattern-based questions
export async function loadPatternQuestions(): Promise<Question[]> {
  try {
    // Read from src/data/pattern-questions.json
    const filePath = path.join(process.cwd(), 'src', 'data', 'pattern-questions.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    if (!data.questions || !Array.isArray(data.questions)) {
      console.error('Pattern questions file is malformed: questions array missing');
      return [];
    }

    return data.questions.map((q: any) => ({
      id: q.id,
      n: q.n,
      category: q.category,
      pattern: q.pattern || 'single-choice',
      qn: q.qn,
      imageUrl: q.imageUrl || q.image_url,
      a4: q.a4,
      an: q.an,
      matchItems: q.matchItems,
      multipleCorrectAnswers: q.multipleCorrectAnswers,
      correctSequence: q.correctSequence,
      blankAnswers: q.blankAnswers
    }));
  } catch (error) {
    console.error('Error loading pattern questions:', error);
    return [];
  }
}

// Function to get pattern questions by category
export async function getPatternQuestionsByCategory(category: string): Promise<Question[]> {
  const questions = await loadPatternQuestions();
  return questions.filter(q => q.category === category);
}

// Function to mix pattern questions with regular questions
export async function mixPatternQuestionsWithRegular(regularQuestions: Question[], patternQuestions: Question[], ratio = 0.3): Promise<Question[]> {
  // If no pattern questions, return regular questions
  if (patternQuestions.length === 0) return regularQuestions;
  
  // Calculate how many pattern questions to include (30% by default)
  const totalQuestions = regularQuestions.length;
  const patternQuestionsCount = Math.min(
    Math.ceil(totalQuestions * ratio),
    patternQuestions.length
  );
  
  // Select random pattern questions
  const selectedPatternQuestions = [...patternQuestions]
    .sort(() => 0.5 - Math.random())
    .slice(0, patternQuestionsCount);
  
  // Calculate how many regular questions to keep
  const regularQuestionsToKeep = totalQuestions - patternQuestionsCount;
  
  // Select random regular questions
  const selectedRegularQuestions = [...regularQuestions]
    .sort(() => 0.5 - Math.random())
    .slice(0, regularQuestionsToKeep);
  
  // Combine and shuffle the questions
  return [...selectedRegularQuestions, ...selectedPatternQuestions]
    .sort(() => 0.5 - Math.random());
}
