import type { Question } from './types';

/**
 * Placeholder function that returns an empty array instead of loading pattern questions
 * This is part of removing the pattern questions feature
 */
export async function loadPatternQuestions(): Promise<Question[]> {
  return [];
}

/**
 * Simplified function that ignores pattern questions and just returns regular questions
 * This is part of removing the pattern questions feature
 */
export async function mixPatternQuestionsWithRegular(
  regularQuestions: Question[],
  patternQuestions: Question[],
  ratio: number
): Promise<Question[]> {
  return [...regularQuestions];
}
