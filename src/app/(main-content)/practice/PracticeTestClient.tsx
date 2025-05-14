
'use client';

import { NumberPagination } from '@/components/shared/NumberPagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Question } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Home, ListChecks, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface PracticeTestClientProps {
  questionsForCurrentPage: Question[];
  currentPage: number;
  totalPages: number;
  category: string;
}

interface QuestionAnswerState {
  selectedOption: number | null;
  revealed: boolean;
  correct: boolean | null;
}

export function PracticeTestClient({
  questionsForCurrentPage,
  currentPage,
  totalPages,
  category
}: PracticeTestClientProps) {
  const [pageAnswers, setPageAnswers] = useState<Record<string, QuestionAnswerState>>({});
  const [pageScore, setPageScore] = useState(0);
  const [incorrectAnswersOnPage, setIncorrectAnswersOnPage] = useState<Question[]>([]);

  useEffect(() => {
    const initialAnswers: Record<string, QuestionAnswerState> = {};
    questionsForCurrentPage.forEach(q => {
      initialAnswers[q.id] = { selectedOption: null, revealed: false, correct: null };
    });
    setPageAnswers(initialAnswers);
  }, [questionsForCurrentPage, currentPage]);

  useEffect(() => {
    let currentScore = 0;
    let currentIncorrectAnswers: Question[] = [];
    questionsForCurrentPage.forEach(q => {
      const answerState = pageAnswers[q.id];
      if (answerState && answerState.revealed && answerState.correct) {
        currentScore++;
      } else if (answerState && answerState.revealed && !answerState.correct) {
        // Find the original question object to add to incorrectAnswersOnPage
        const originalQuestion = questionsForCurrentPage.find(ques => ques.id === q.id);
        if (originalQuestion) {
            currentIncorrectAnswers.push(originalQuestion);
        }
      }
    });
    setPageScore(currentScore);
    setIncorrectAnswersOnPage(currentIncorrectAnswers);
  }, [pageAnswers, questionsForCurrentPage]);

  const handleOptionSelection = (questionId: string, selectedOptionIndex: number) => {
    const question = questionsForCurrentPage.find(q => q.id === questionId);
    // Do not allow re-answering if already revealed
    if (!question || (pageAnswers[questionId] && pageAnswers[questionId].revealed)) return;

    const isCorrect = question.a4[selectedOptionIndex] === question.an;

    setPageAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: {
        selectedOption: selectedOptionIndex,
        revealed: true,
        correct: isCorrect,
      }
    }));
  };

  const attemptedQuestionsCount = useMemo(() => {
    return Object.values(pageAnswers).filter(answer => answer.revealed).length;
  }, [pageAnswers]);

  const progressValue = questionsForCurrentPage.length > 0 ? (attemptedQuestionsCount / questionsForCurrentPage.length) * 100 : 0;

  

  if (!questionsForCurrentPage || questionsForCurrentPage.length === 0) {
    return (
      <div className="container py-8 text-center">
         <Alert variant="destructive">
            <AlertTitle>No Questions Loaded For This Page</AlertTitle>
            <AlertDescription>
                There was an issue loading questions for this page. Please try navigating or selecting a category again.
            </AlertDescription>
        </Alert>
         <Button asChild className="mt-6"><Link href="/practice"><Home className="mr-2 h-4 w-4"/>Back to Category Selection</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
        <div className="flex-grow max-w-3xl mx-auto w-full">
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle>Page {currentPage}/{totalPages} - Practice Questions ({questionsForCurrentPage.length} questions)</CardTitle>
              <Progress value={progressValue} className="mt-2 h-2.5" />
              
            </CardHeader>
            <CardContent className="space-y-10">
              {questionsForCurrentPage.map((question, index) => {
                const answerState = pageAnswers[question.id];
                return (
                  <div key={question.id} className="p-4 border rounded-lg shadow-sm bg-background hover:shadow-md transition-shadow">
                    <p className="text-base sm:text-lg font-semibold mb-3">
                      Question {index + 1}: {question.qn || "चित्रमा आधारित प्रश्न:"}
                    </p>
                    {question.imageUrl && (
                      <div className="my-3 flex justify-center">
                        <Image
                          src={question.imageUrl}
                          alt={`प्रश्न ${index + 1} सम्बन्धित छवि`}
                          width={250}
                          height={125}
                          className="rounded-md object-contain border"
                          data-ai-hint="traffic scenario diagram"
                        />
                      </div>
                    )}
                    <RadioGroup
                      value={answerState?.selectedOption?.toString()}
                      onValueChange={(value) => handleOptionSelection(question.id, parseInt(value))}
                      className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2"
                    >
                      {question.a4.map((optionText, optionIndex) => {
                        let optionStyle = "border-border hover:border-primary";
                        if (answerState?.revealed) {
                          if (optionText === question.an) {
                            optionStyle = "border-accent bg-accent/10 text-accent-foreground";
                          } else if (answerState.selectedOption === optionIndex) {
                            optionStyle = "border-destructive bg-destructive/10 text-destructive-foreground";
                          }
                        }
                        
                        return (
                          <div key={optionIndex} className={cn(
                            "flex items-start space-x-2.5 p-2.5 rounded-lg border transition-all text-sm",
                            optionStyle,
                            answerState?.revealed ? "cursor-default" : "cursor-pointer"
                          )}>
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              id={`${question.id}-opt-${optionIndex}-${currentPage}`}
                              className="shrink-0 mt-0.5"
                              disabled={answerState?.revealed}
                              checked={answerState?.selectedOption === optionIndex}
                            />
                            <Label
                              htmlFor={`${question.id}-opt-${optionIndex}-${currentPage}`}
                              className={cn("flex-1 leading-snug", answerState?.revealed ? "cursor-default" : "cursor-pointer")}
                            >
                              {optionText}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                    {answerState?.revealed && (
                      <Alert className={`mt-4 text-sm ${answerState.correct ? 'border-accent text-accent' : 'border-destructive text-destructive'}`}>
                        {answerState.correct ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        <AlertTitle>{answerState.correct ? 'सही!' : 'गलत!'}</AlertTitle>
                        {!answerState.correct && (
                          <AlertDescription>
                            सही उत्तर हो: {question.an}
                          </AlertDescription>
                        )}
                      </Alert>
                    )}
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="flex-col items-center gap-4 pt-6 border-t mt-6">
                <div className="text-xl font-semibold">
                  Page Score: <span className="text-primary">{pageScore}</span> / {questionsForCurrentPage.length}
                </div>
                
                {incorrectAnswersOnPage.length > 0 && attemptedQuestionsCount === questionsForCurrentPage.length && (
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="rounded-lg">Review Incorrect Answers (This Page)</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Incorrect Answers - Page {currentPage}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Review the questions you answered incorrectly on this page.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-4 my-4">
                        {incorrectAnswersOnPage.map((q, idx) => (
                          <Card key={`${q.id}-incorrect-${idx}`} className="p-4 rounded-md border-destructive bg-destructive/5">
                            <p className="font-semibold">{q.qn || `Question (Image ID: ${q.n})`}</p>
                            {q.imageUrl && (
                               <Image src={q.imageUrl} alt={`Image for question ${q.n}`} width={150} height={75} className="my-1 rounded-sm border" data-ai-hint="question illustration" />
                            )}
                            <p className="text-sm text-muted-foreground mt-1">Correct Answer: {q.an}</p>
                          </Card>
                        ))}
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-md">Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                 <Button asChild variant="secondary" className="w-full sm:w-auto mt-2">
                    <Link href="/practice">
                      <ListChecks className="mr-2 h-4 w-4" /> Choose Another Category
                    </Link>
                  </Button>
            </CardFooter>
          </Card>

          {totalPages > 0 && (
               <div className="mt-8 flex justify-center">
                  <NumberPagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath={`/practice/${category}`}
                  />
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

