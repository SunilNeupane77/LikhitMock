
'use client';

import type React from 'react';
import Image from 'next/image';
import type { MockExamResult, Question, ExamCategoryType } from '@/lib/types'; 
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface ExamResultsScreenProps {
  examResult: MockExamResult;
  examQuestions: Question[];
  passPercentage: number;
  onClose: () => void;
  onRestartExam: () => void;
  showResultsDialog: boolean;
  setShowResultsDialog: (show: boolean) => void;
}

export function ExamResultsScreen({
  examResult,
  examQuestions,
  passPercentage,
  onClose,
  onRestartExam,
  showResultsDialog,
  setShowResultsDialog,
}: ExamResultsScreenProps) {
  const passed = examResult.totalQuestions > 0 && (examResult.score / examResult.totalQuestions) >= passPercentage;

  const handleCloseAndReset = () => {
    setShowResultsDialog(false);
    onClose();
  };

  const handleRestartAndClose = () => {
    setShowResultsDialog(false);
    onRestartExam();
  };

  function getCategoryDisplayName(category: ExamCategoryType): string {
    switch (category) {
      case 'A': return 'Category A (Bike/Scooter)'; // Updated
      case 'B': return 'Category B (Car/Jeep/Van)';
      case 'Traffic': return 'Traffic Signs';
      case 'Mixed': return 'Mixed Exam (All Categories)';
      default: return category;
    }
  }


  return (
    <AlertDialog open={showResultsDialog} onOpenChange={(open) => {
      setShowResultsDialog(open);
      if (!open) {
        onClose();
      }
    }}>
      <AlertDialogContent className="max-h-[90vh] max-w-lg w-full overflow-y-auto rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">Real Exam Results</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="my-6 space-y-4 text-center">
          <p className="text-3xl font-bold">
            Your Score: <span className={`${passed ? 'text-accent' : 'text-destructive'}`}>{examResult.score} / {examResult.totalQuestions}</span>
          </p>
          {examResult.totalQuestions > 0 && <Progress value={(examResult.score / examResult.totalQuestions) * 100} className="w-full h-3 rounded-full" />}
          <p className={`text-xl font-semibold ${passed ? 'text-accent' : 'text-destructive'}`}>
            {passed ? 'Congratulations! You passed!' : 'Unfortunately, you did not pass. Keep practicing!'}
          </p>
          <p className="text-sm text-muted-foreground">(Pass mark {passPercentage * 100}%)</p>

          <details className="mt-6 text-left">
            <summary className="cursor-pointer font-medium text-primary hover:underline text-center">View Answer Details</summary>
            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto border p-4 rounded-md bg-muted/30">
              {examQuestions.map((q, idx) => {
                const ans = examResult.answers.find(a => a.questionId === q.id);
                if (!ans) return null;
                const selectedOptionText = ans.selectedOptionIndex !== null ? q.a4[ans.selectedOptionIndex] : null;
                const correctOptionText = q.an;

                return (
                  <Card key={idx} className={`p-3 rounded-md ${ans.isCorrect ? 'border-accent bg-accent/5' : 'border-destructive bg-destructive/5'}`}>
                    <p className="font-semibold text-sm mb-1 text-card-foreground">{idx + 1}. {q.qn || `Question ${q.n}`}</p> 
                     {q.imageUrl && (
                      <Image src={q.imageUrl} alt={`Image for question ${q.n}`} width={150} height={75} className="my-1 rounded-sm border" data-ai-hint="question illustration" />
                    )}
                    <p className={`text-xs ${ans.isCorrect ? 'text-accent-foreground' : 'text-destructive-foreground'}`}>
                      <span className="font-medium text-foreground/80">Your Answer:</span> {selectedOptionText !== null ? <span className='font-normal text-foreground/80'>{selectedOptionText}</span> : 'Not Answered'} 
                      {ans.isCorrect ? <CheckCircle className="inline ml-1 h-3 w-3 text-accent" /> : <XCircle className="inline ml-1 h-3 w-3 text-destructive" />}
                    </p>
                    {!ans.isCorrect && <p className="text-xs text-muted-foreground mt-0.5"><span className="font-medium text-foreground/80">Correct Answer:</span> {correctOptionText}</p>} 
                  </Card>
                );
              })}
            </div>
          </details>
        </div>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 pt-4">
          <AlertDialogCancel asChild>
             <Button variant="outline" className="w-full sm:w-auto rounded-md" asChild>
                <Link href="/real-exam" onClick={handleCloseAndReset}>Try Another Category</Link>
             </Button>
          </AlertDialogCancel>
           <Button asChild className="w-full sm:w-auto rounded-md">
            <Link href={`/real-exam/${examResult.category}`} onClick={handleRestartAndClose}>
                <RotateCcw className="mr-2 h-4 w-4" /> Retake This Exam
            </Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

