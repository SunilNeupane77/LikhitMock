
'use client';

import type React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Question } from '@/lib/types'; 
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionStatusIndicatorProps {
  questions: Question[];
  userAnswers: (number | null)[]; 
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  className?: string;
  layout: 'desktop' | 'mobile';
}

export const QuestionStatusIndicator: React.FC<QuestionStatusIndicatorProps> = ({
  questions,
  userAnswers,
  currentQuestionIndex,
  onQuestionSelect,
  className,
  layout,
}) => {
  if (!questions || questions.length === 0) {
    return null;
  }

  const gridColsClass = layout === 'desktop' ? 'grid-cols-4' : 'grid-cols-5 sm:grid-cols-6';

  const containerClasses = cn(
    "rounded-lg shadow-md bg-card",
    layout === 'desktop' ? "p-3 w-full" : "p-2 w-full",
    className
  );

  const scrollAreaMaxHeight = layout === 'desktop' ? 'max-h-[calc(100vh-160px)]' : 'max-h-36';


  return (
    <div className={containerClasses}>
      <h3 className="text-sm font-semibold mb-2 text-center text-card-foreground">
        Questions
      </h3>
      <ScrollArea className={cn("overflow-y-auto", scrollAreaMaxHeight)}>
        <div className={cn("grid gap-1.5 p-1", gridColsClass)}>
          {questions.map((_, index) => {
            const isAnswered = userAnswers[index] !== null;
            const isCurrent = index === currentQuestionIndex;

            return (
              <Button
                key={`q-status-${index}`}
                size="icon"
                className={cn(
                  "h-8 w-8 text-xs rounded-full font-medium transition-all duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary-foreground ring-offset-2 ring-offset-primary scale-105 shadow-lg",
                  !isCurrent && isAnswered && "bg-accent text-accent-foreground hover:bg-accent/90",
                  !isCurrent && !isAnswered && "bg-muted text-muted-foreground hover:bg-muted/80 border border-border",
                )}
                onClick={() => onQuestionSelect(index)}
                aria-label={`Go to Question ${index + 1}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
