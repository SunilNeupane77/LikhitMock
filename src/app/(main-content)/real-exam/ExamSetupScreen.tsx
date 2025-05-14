
'use client';

import type React from 'react';
import type { MockExamResult, ExamCategoryType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { History, ClipboardCheckIcon, Tag, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; 

const REAL_EXAM_QUESTIONS_COUNT = 25;
const REAL_EXAM_TIME_LIMIT_SECONDS = 25 * 60;

interface ExamSetupScreenProps {
  fixedCategory: ExamCategoryType;
  onStartExam: () => void;
  pastResults: MockExamResult[];
  showPastResultsDialog: boolean;
  setShowPastResultsDialog: (show: boolean) => void;
  isCategoryBComingSoon: boolean; 
}

function getCategoryDisplayName(category: ExamCategoryType): string {
  switch (category) {
    case 'A': return 'Category A (Bike/Scooter)'; 
    case 'B': return 'Category B (Car/Jeep/Van)';
    case 'Traffic': return 'Traffic Signs';
    case 'Mixed': return 'Mixed Exam (All Categories)';
    default: return category;
  }
}


export function ExamSetupScreen({
  fixedCategory,
  onStartExam,
  pastResults,
  showPastResultsDialog,
  setShowPastResultsDialog,
  isCategoryBComingSoon, 
}: ExamSetupScreenProps) {
  const categoryDisplayName = getCategoryDisplayName(fixedCategory);

  return (
    <div className="flex-grow max-w-lg w-full">
      <Card className="w-full shadow-xl rounded-xl">
        
        <CardContent className="space-y-6 pt-6">
          <div className="p-4 border rounded-md bg-muted/30">
            <div className="flex items-center mb-2">
              <Tag className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-semibold text-lg">Selected Category</h3>
            </div>
            <p className="text-xl font-bold text-primary">{categoryDisplayName}</p>
            {fixedCategory === 'Mixed' && (
                <p className="text-xs text-muted-foreground mt-1">This provides the most realistic simulation of the official exam.</p>
            )}
          </div>

          {isCategoryBComingSoon && fixedCategory === 'B' && (
             <Alert variant="default">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Coming Soon!</AlertTitle>
                <AlertDescription>
                    Questions for Category B (Car/Jeep/Van) are currently unavailable. Please check back later.
                </AlertDescription>
            </Alert>
          )}

          <div className="p-4 border rounded-md bg-muted/50">
            <p className="font-semibold">Exam Details:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Number of Questions: {REAL_EXAM_QUESTIONS_COUNT}</li>
              <li>Time Limit: {REAL_EXAM_TIME_LIMIT_SECONDS / 60} minutes</li>
              <li>Results will be shown after completion.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-6">
          <Button 
            onClick={onStartExam} 
            className="w-full text-lg py-6 rounded-lg" 
            disabled={isCategoryBComingSoon && fixedCategory === 'B'}
          >
            <ClipboardCheckIcon className="mr-2 h-5 w-5" />
            {isCategoryBComingSoon && fixedCategory === 'B' ? 'Coming Soon' : 'Start Real Exam'}
          </Button>
          {pastResults.length > 0 && (
            <AlertDialog open={showPastResultsDialog} onOpenChange={setShowPastResultsDialog}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full rounded-lg" 
                  disabled={isCategoryBComingSoon && fixedCategory === 'B'}
                >
                    <History className="mr-2 h-4 w-4" />View Past Results for this Category
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Past Exam Results: {categoryDisplayName}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-3 my-4">
                  {pastResults.map((res, idx) => (
                    <Card key={idx} className="p-3 rounded-md">
                      <p>Date: {new Date(res.date).toLocaleDateString('en-US')} {res.category ? `(Category: ${getCategoryDisplayName(res.category)})` : ''}</p>
                      <p>Score: {res.score}/{res.totalQuestions}</p>
                    </Card>
                  ))}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-md">Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
