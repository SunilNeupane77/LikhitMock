'use client';

import { PatternQuestion } from '@/components/shared/PatternQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Question } from '@/lib/types';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
// Metadata is exported from metadata.ts file

const patternExampleQuestions: Record<string, Question> = {
  'single-choice': {
    id: 'example-single',
    n: 'example-single',
    category: 'A',
    pattern: 'single-choice',
    qn: 'नेपालमा कुन साइडबाट सवारी चलाइन्छ?',
    a4: ['दायाँ', 'बायाँ', 'दुवै', 'कुनै पनि होइन'],
    an: 'बायाँ'
  },
  'multiple-choice': {
    id: 'example-multiple',
    n: 'example-multiple',
    category: 'A',
    pattern: 'multiple-choice',
    qn: 'सवारी चलाउँदा निम्न मध्ये कुन कुन कुराहरू ध्यान दिनुपर्छ?',
    a4: ['ट्राफिक नियम पालना', 'सीट बेल्ट लगाउने', 'अत्यधिक गतिमा चलाउने', 'मोबाइलमा कुरा गर्ने'],
    an: 'ट्राफिक नियम पालना',
    multipleCorrectAnswers: ['ट्राफिक नियम पालना', 'सीट बेल्ट लगाउने']
  },
  'true-false': {
    id: 'example-tf',
    n: 'example-tf',
    category: 'A',
    pattern: 'true-false',
    qn: 'नेपालमा गाडी दाहिने साइडबाट चलाइन्छ।',
    a4: ['सत्य', 'असत्य'],
    an: 'असत्य'
  },
  'matching': {
    id: 'example-match',
    n: 'example-match',
    category: 'Traffic',
    pattern: 'matching',
    qn: 'निम्न ट्राफिक चिन्हहरूलाई तिनको अर्थसँग मिलाउनुहोस्:',
    a4: ['सबै मिलाएँ', 'एक मिलाएँ', 'दुई मिलाएँ', 'तीन मिलाएँ'],
    an: 'सबै मिलाएँ',
    matchItems: [
      { left: 'लाल वृत्त र सेतो क्रस', right: 'प्रवेश निषेध' },
      { left: 'त्रिभुजाकार चिन्ह', right: 'सचेतनात्मक संकेत' },
      { left: 'आयताकार चिन्ह', right: 'सूचनामूलक संकेत' },
      { left: 'लाल वृत्त', right: 'प्रतिबन्धात्मक संकेत' }
    ]
  },
  'sequence': {
    id: 'example-seq',
    n: 'example-seq',
    category: 'B',
    pattern: 'sequence',
    qn: 'सवारी चालक अनुमतिपत्र प्राप्त गर्न निम्न प्रक्रियाहरूलाई सही क्रममा राख्नुहोस्:',
    a4: ['सही क्रम: 1,3,2,4', 'सही क्रम: 3,1,4,2', 'सही क्रम: 3,1,2,4', 'सही क्रम: 1,2,3,4'],
    an: 'सही क्रम: 1,2,3,4',
    correctSequence: ['अनलाइन फारम भर्ने', 'लिखित परीक्षा दिने', 'प्रयोगात्मक परीक्षा दिने', 'अनुमतिपत्र प्राप्त गर्ने']
  }
};

export default function PatternExamplesPage() {
  const [activeTab, setActiveTab] = useState('single-choice');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [isCorrect, setIsCorrect] = useState<Record<string, boolean | null>>({});

  // Memoize handlers to prevent unnecessary re-renders
  const handleAnswer = React.useCallback((pattern: string, answer: any) => {
    setAnswers(prev => {
      // Only update if the answer has changed
      if (JSON.stringify(prev[pattern]) !== JSON.stringify(answer)) {
        return {...prev, [pattern]: answer};
      }
      return prev;
    });
  }, []);

  const handleReveal = React.useCallback((pattern: string) => {
    setRevealed(prev => {
      // If already revealed, don't update
      if (prev[pattern]) return prev;
      return {...prev, [pattern]: true};
    });
    
    // Use a functional update to ensure we're using the latest state
    setIsCorrect(prevIsCorrect => {
      // Get current answers from closure
      const currentAnswers = answers;
      const question = patternExampleQuestions[pattern];
      let correct = false;
      
      switch(pattern) {
        case 'multiple-choice':
          if (Array.isArray(currentAnswers[pattern]) && Array.isArray(question.multipleCorrectAnswers)) {
            const selectedOptions = currentAnswers[pattern].map((i: number) => question.a4[i]);
            correct = 
              selectedOptions.length === question.multipleCorrectAnswers.length && 
              selectedOptions.every(opt => question.multipleCorrectAnswers?.includes(opt));
          }
          break;
        case 'true-false':
          correct = question.a4[currentAnswers[pattern]] === question.an;
          break;
        case 'matching':
          if (typeof currentAnswers[pattern] === 'object' && question.matchItems) {
            const matching = currentAnswers[pattern] as Record<string, string>;
            correct = question.matchItems.every(item => matching[item.left] === item.right);
          }
          break;
        case 'sequence':
          if (Array.isArray(currentAnswers[pattern]) && Array.isArray(question.correctSequence)) {
            correct = 
              currentAnswers[pattern].length === question.correctSequence.length &&
              currentAnswers[pattern].every((item, i) => item === question.correctSequence?.[i]);
          }
          break;
        case 'single-choice':
        default:
          correct = question.a4[currentAnswers[pattern]] === question.an;
          break;
      }
      
      return {...prevIsCorrect, [pattern]: correct};
    });
  }, [answers]);

  return (
    <div className="container py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Question Pattern Examples</h1>
        <p className="mt-4 text-muted-foreground">
          LikhitMock now supports various question patterns to better prepare you for the driving license exam.
          Explore each pattern below to understand how they work.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Question Patterns</CardTitle>
          <CardDescription>
            Select a tab below to see examples of different question patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="single-choice">Single Choice</TabsTrigger>
              <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
              <TabsTrigger value="true-false">True/False</TabsTrigger>
              <TabsTrigger value="matching">Matching</TabsTrigger>
              <TabsTrigger value="sequence">Sequence</TabsTrigger>
            </TabsList>
            
            {Object.keys(patternExampleQuestions).map(pattern => {
              // Memoize the pattern description to prevent unnecessary re-renders
              const patternDescription = React.useMemo(() => {
                switch(pattern) {
                  case 'single-choice':
                    return 'Choose the one correct answer from the options provided.';
                  case 'multiple-choice':
                    return 'Select all correct answers from the options provided.';
                  case 'true-false':
                    return 'Determine whether the statement is true or false.';
                  case 'matching':
                    return 'Match items from the left column with their corresponding items in the right column.';
                  case 'sequence':
                    return 'Arrange the items in the correct sequence or order.';
                  default:
                    return '';
                }
              }, [pattern]);

              return (
                <TabsContent key={pattern} value={pattern} className="mt-4 pt-4 border-t">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">{pattern.charAt(0).toUpperCase() + pattern.slice(1).replace('-', ' ')} Questions</h3>
                    <p className="text-muted-foreground">{patternDescription}</p>
                  </div>
                  
                  <PatternQuestion 
                    key={`pattern-question-${pattern}`}
                    question={patternExampleQuestions[pattern]}
                    questionNumber={1}
                    selectedOption={answers[pattern]}
                    selectedMatching={pattern === 'matching' ? answers[pattern] || {} : {}}
                    selectedSequence={pattern === 'sequence' ? answers[pattern] || [] : []}
                    revealed={revealed[pattern] || false}
                    isCorrect={isCorrect[pattern]}
                    onAnswer={(answer) => handleAnswer(pattern, answer)}
                    onReveal={() => handleReveal(pattern)}
                    showRevealButton={true}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> 
              Go to Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/practice">
              Practice Tests 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
