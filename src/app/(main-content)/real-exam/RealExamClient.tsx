'use client';

import { QuestionStatusIndicator } from '@/components/shared/QuestionStatusIndicator';
import { useToast } from '@/hooks/use-toast';
import type { ExamCategoryType, MockExamResult, Question } from '@/lib/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ExamInProgressScreen } from './ExamInProgressScreen';
import { ExamResultsScreen } from './ExamResultsScreen';
import { ExamSetupScreen } from './ExamSetupScreen';

const REAL_EXAM_QUESTIONS_COUNT = 25;
const REAL_EXAM_TIME_LIMIT_SECONDS = 25 * 60; // 25 minutes
const PASS_PERCENTAGE = 0.7; // 70% to pass
const NUM_TRAFFIC_QUESTIONS_IN_MIX = () => Math.floor(Math.random() * 2) + 4; // 4 or 5

interface RealExamClientProps {
  allQuestions: Question[]; 
  initialCategory: ExamCategoryType;
  isCategoryBComingSoon: boolean; 
}

export function RealExamClient({ allQuestions, initialCategory, isCategoryBComingSoon }: RealExamClientProps) {
  const { toast } = useToast();

  const [examCategory] = useState<ExamCategoryType>(initialCategory);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]); 
  const [timeLeft, setTimeLeft] = useState(REAL_EXAM_TIME_LIMIT_SECONDS);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [showPastResultsDialog, setShowPastResultsDialog] = useState(false);
  const [pastResults, setPastResults] = useState<MockExamResult[]>([]);



  useEffect(() => {
    const storedResults = localStorage.getItem(`realExamResults_${examCategory}`);
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        if (Array.isArray(parsedResults)) {
          setPastResults(parsedResults);
        } else {
          setPastResults([]);
          localStorage.removeItem(`realExamResults_${examCategory}`);
        }
      } catch (e) {
        console.error("Failed to parse past results:", e);
        setPastResults([]);
        localStorage.removeItem(`realExamResults_${examCategory}`); 
      }
    } else {
        setPastResults([]); 
    }
  }, [examCategory]);


  const saveResult = useCallback((result: MockExamResult) => {
     const currentResults = localStorage.getItem(`realExamResults_${examCategory}`);
    let existingResults: MockExamResult[] = [];
    if (currentResults) {
        try {
            existingResults = JSON.parse(currentResults);
             if (!Array.isArray(existingResults)) { 
               existingResults = [];
             }
        } catch (e) {
            console.error("Error parsing existing results:", e);
            existingResults = []; 
        }
    }
    const updatedResults = [result, ...existingResults].slice(0, 10); 
    setPastResults(updatedResults);
    localStorage.setItem(`realExamResults_${examCategory}`, JSON.stringify(updatedResults));
  }, [examCategory]);

  const finishExamCallback = useCallback(() => {
    setExamFinished(currentExamFinished => {
      if (currentExamFinished) { 
        return true;
      }
      setExamStarted(false); 
      let score = 0;
      const answerDetails = examQuestions.map((q, idx) => {
        const selectedIndex = userAnswers[idx];
        const isCorrect = selectedIndex !== null && q.a4[selectedIndex] === q.an;
        if (isCorrect) score++;
        return { questionId: q.id, selectedOptionIndex: selectedIndex, isCorrect };
      });

      const resultData: MockExamResult = {
        score,
        totalQuestions: examQuestions.length,
        date: new Date().toISOString(),
        answers: answerDetails,
        category: examCategory, 
      };
      setExamResult(resultData);
      saveResult(resultData);
      setShowResultsDialog(true); 
      return true; 
    });
  }, [examQuestions, userAnswers, examCategory, saveResult]);

  const finishExamRef = useRef(finishExamCallback);
  useEffect(() => {
    finishExamRef.current = finishExamCallback;
  }, [finishExamCallback]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            finishExamRef.current(); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && examStarted && !examFinished) {
        finishExamRef.current();
    }
    return () => clearInterval(timer);
  }, [examStarted, examFinished, timeLeft]);


  const startExam = useCallback(() => {
    // Removed isCategoryBComingSoon check since Category B is now available

    let finalExamQuestions: Question[] = [];

    const availableTextualA = allQuestions.filter(q => q.category === 'A');
    const availableTextualB = allQuestions.filter(q => q.category === 'B');
    const availableTraffic = allQuestions.filter(q => q.category === 'Traffic');
    
    if (examCategory === 'A' || examCategory === 'B' || examCategory === 'Mixed') {
        const numTrafficToSelect = Math.min(availableTraffic.length, NUM_TRAFFIC_QUESTIONS_IN_MIX());
        const numTextualToSelect = REAL_EXAM_QUESTIONS_COUNT - numTrafficToSelect;

        const selectedTraffic = [...availableTraffic].sort(() => 0.5 - Math.random()).slice(0, numTrafficToSelect);
        
        let sourceTextual: Question[];
        if (examCategory === 'Mixed') {
            sourceTextual = [...availableTextualA, ...availableTextualB];
        } else { 
            sourceTextual = allQuestions.filter(q => q.category === examCategory); 
        }
        const selectedTextual = [...sourceTextual].sort(() => 0.5 - Math.random()).slice(0, numTextualToSelect);
        
        finalExamQuestions = [...selectedTextual, ...selectedTraffic].sort(() => 0.5 - Math.random());

    } else if (examCategory === 'Traffic') {
        finalExamQuestions = [...availableTraffic].sort(() => 0.5 - Math.random()).slice(0, REAL_EXAM_QUESTIONS_COUNT);
    }
    
    if (finalExamQuestions.length > REAL_EXAM_QUESTIONS_COUNT) {
        finalExamQuestions = finalExamQuestions.slice(0, REAL_EXAM_QUESTIONS_COUNT);
    }

    if (finalExamQuestions.length === 0) {
      toast({
        title: "Error",
        description: `No questions available to start the exam for category ${examCategory}.`,
        variant: "destructive",
      });
      return; 
    }
    
    if (finalExamQuestions.length < REAL_EXAM_QUESTIONS_COUNT) {
        toast({
            title: "Warning",
            description: `The exam will have ${finalExamQuestions.length} questions as fewer than ${REAL_EXAM_QUESTIONS_COUNT} were available for the selected category and desired mix.`,
            variant: "default", 
            duration: 5000,
        });
    }

    setExamQuestions(finalExamQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(finalExamQuestions.length).fill(null));
    setTimeLeft(REAL_EXAM_TIME_LIMIT_SECONDS);
    setExamStarted(true);
    setExamFinished(false);
    setExamResult(null);
    setShowResultsDialog(false);
  }, [allQuestions, examCategory, toast]); 

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNavigateQuestion = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentQuestionIndex(prev => Math.min(examQuestions.length - 1, prev + 1));
    } else {
      setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleSelectQuestionFromIndicator = (index: number) => {
    if (index >= 0 && index < examQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };
  
  const handleConfirmFinishExam = () => {
    finishExamRef.current();
  };

  const currentQuestion = examQuestions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleCloseResults = () => {
    setExamFinished(false); 
    setExamResult(null);
    setShowResultsDialog(false); 
  };

  const handleRestartExam = () => {
    setShowResultsDialog(false);
    startExam();
  };


  if (!examStarted && !examFinished) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 justify-center items-start">
        <div className="hidden lg:block w-48 shrink-0"></div> 


        <ExamSetupScreen
          fixedCategory={examCategory}
          onStartExam={startExam}
          pastResults={pastResults}
          showPastResultsDialog={showPastResultsDialog}
          setShowPastResultsDialog={setShowPastResultsDialog}
          isCategoryBComingSoon={false} 
        />
        
        <div className="hidden lg:block w-48 shrink-0"></div>



      </div>
    );
  }

  if (examStarted && currentQuestion && !examFinished) {
    return (
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
           <div className="hidden lg:block w-48 shrink-0">
            <QuestionStatusIndicator
              questions={examQuestions}
              userAnswers={userAnswers}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleSelectQuestionFromIndicator}
              layout="desktop"
              className="sticky top-20" 
            />
          </div>

          <ExamInProgressScreen
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            examQuestionsLength={examQuestions.length}
            timeLeftFormatted={formatTime(timeLeft)}
            userAnswers={userAnswers}
            onAnswerSelect={handleAnswerSelect}
            onNavigateQuestion={handleNavigateQuestion}
            onConfirmFinishExam={handleConfirmFinishExam}
          />

          <aside className="hidden lg:block w-48 space-y-6 shrink-0">
            <div className="min-h-[250px] w-full sticky top-20"/>
          </aside>
        </div>

        <div className="lg:hidden mt-8 w-full">
          <QuestionStatusIndicator
            questions={examQuestions}
            userAnswers={userAnswers}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={handleSelectQuestionFromIndicator}
            layout="mobile"
          />
        </div>
      </div>
    );
  }

  if (examFinished && examResult) {
     return (
      <div className="flex flex-col lg:flex-row gap-4 justify-center items-start w-full">
        <div className="hidden lg:block w-48 shrink-0 space-y-6">
            {examQuestions.length > 0 ? (
                 <QuestionStatusIndicator
                    questions={examQuestions}
                    userAnswers={userAnswers} 
                    currentQuestionIndex={-1} 
                    onQuestionSelect={() => {}} 
                    layout="desktop"
                    className="sticky top-20 opacity-70" 
                />
            ) : <div className="w-48 shrink-0" />}
        </div>

         <ExamResultsScreen
            examResult={examResult}
            examQuestions={examQuestions}
            passPercentage={PASS_PERCENTAGE}
            onClose={handleCloseResults} 
            onRestartExam={handleRestartExam} 
            showResultsDialog={showResultsDialog}
            setShowResultsDialog={setShowResultsDialog}
        />

        <aside className="hidden lg:block w-48 space-y-6 shrink-0">
            <div className="w-48 shrink-0"/>
        </aside>

        <div className="lg:hidden mt-8 w-full">
          {examQuestions.length > 0 ? (
            <QuestionStatusIndicator
                questions={examQuestions}
                userAnswers={userAnswers}
                currentQuestionIndex={-1}
                onQuestionSelect={() => {}}
                layout="mobile"
                className="opacity-70" 
            />
          ): null}
        </div>
      </div>
    );
  }

  return null; 
}
