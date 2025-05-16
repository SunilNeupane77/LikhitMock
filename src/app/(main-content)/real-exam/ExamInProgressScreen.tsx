
'use client';

import { useState } from 'react';
import { PatternQuestion } from '@/components/shared/PatternQuestion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Question } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import Image from 'next/image';

interface ExamInProgressScreenProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  examQuestionsLength: number;
  timeLeftFormatted: string;
  userAnswers: (number | null)[]; 
  onAnswerSelect: (optionIndex: number) => void;
  onNavigateQuestion: (direction: 'next' | 'prev') => void;
  onConfirmFinishExam: () => void;
}

export function ExamInProgressScreen({
  currentQuestion,
  currentQuestionIndex,
  examQuestionsLength,
  timeLeftFormatted,
  userAnswers,
  onAnswerSelect,
  onNavigateQuestion,
  onConfirmFinishExam,
}: ExamInProgressScreenProps) {

  // Handle different question pattern answers
  const [patternAnswer, setPatternAnswer] = useState<any>(null);
  
  // Handle pattern question answers
  const handlePatternAnswer = (answer: any) => {
    setPatternAnswer(answer);
    // For now, we won't set the answer in userAnswers directly, as we want to support finishing the exam properly
  }
  
  const handlePatternReveal = () => {
    // This is just a placeholder in the exam - we don't actually reveal answers during the exam
    // but we record that the user has made a selection
    if (patternAnswer !== null) {
      onAnswerSelect(0); // Just mark it as answered for now
    }
  }
  
  const renderOption = (optionText: string, index: number) => {
    const optionId = `option-real-exam-${currentQuestion.id}-${index}`;
    return (
      <div key={optionId} className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border transition-all",
        userAnswers[currentQuestionIndex] === index ? "border-primary bg-primary/10" : "border-border hover:border-primary"
      )}>
        <RadioGroupItem
          value={index.toString()}
          id={optionId}
          className="shrink-0"
          checked={userAnswers[currentQuestionIndex] === index}
        />
        <Label htmlFor={optionId} className="flex-1 cursor-pointer text-base">
          <p>{optionText}</p>
        </Label>
      </div>
    );
  };

  return (
    <div className="flex-grow max-w-2xl w-full">
      <Card className="w-full shadow-xl rounded-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Question {currentQuestionIndex + 1} / {examQuestionsLength}</CardTitle>
            <div className="flex items-center text-lg font-semibold text-destructive">
              <Timer className="mr-2 h-5 w-5" /> {timeLeftFormatted}
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / examQuestionsLength) * 100} className="mt-2 h-2.5" />
          <CardDescription className="pt-6 text-xl font-semibold leading-relaxed">
            {currentQuestion.qn}
          </CardDescription>
          {currentQuestion.imageUrl && (
            <div className="mt-4 flex justify-center">
              <Image
                src={currentQuestion.imageUrl}
                alt="Question related image"
                width={300}
                height={150}
                className="rounded-md object-contain border"
                data-ai-hint="traffic scenario"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {currentQuestion.pattern ? (
            // Render pattern questions using PatternQuestion component
            <PatternQuestion
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedOption={patternAnswer}
              selectedMatching={typeof patternAnswer === 'object' && patternAnswer !== null ? patternAnswer : {}}
              selectedSequence={Array.isArray(patternAnswer) ? patternAnswer : []}
              revealed={false} // Never reveal in exam mode
              onAnswer={handlePatternAnswer}
              onReveal={handlePatternReveal}
              showRevealButton={true}
              disabled={false}
            />
          ) : (
            // Render traditional questions
            <RadioGroup
              key={`${currentQuestion.id}-${currentQuestionIndex}`}
              value={userAnswers[currentQuestionIndex] !== null ? userAnswers[currentQuestionIndex]!.toString() : undefined}
              onValueChange={(value) => onAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {currentQuestion.a4.map(renderOption)}
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button
            onClick={() => onNavigateQuestion('prev')}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            className="rounded-lg"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex < examQuestionsLength - 1 ? (
            <Button onClick={() => onNavigateQuestion('next')} className="rounded-lg">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded-lg">Finish Exam</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Finish</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to finish the exam? Unanswered questions will be marked incorrect.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onConfirmFinishExam} className="rounded-md">Finish</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
