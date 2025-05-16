'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type Question } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface PatternQuestionProps {
  question: Question;
  questionNumber: number;
  selectedOption?: number | number[] | null;
  selectedMatching?: { [key: string]: string };
  selectedSequence?: string[];
  filledBlanks?: string[];
  revealed: boolean;
  isCorrect?: boolean | null;
  onAnswer: (answer: any) => void;
  onReveal?: () => void;
  showRevealButton?: boolean;
  disabled?: boolean;
}

export function PatternQuestion({
  question,
  questionNumber,
  selectedOption = null,
  selectedMatching = {},
  selectedSequence = [],
  filledBlanks = [],
  revealed = false,
  isCorrect = null,
  onAnswer,
  onReveal,
  showRevealButton = true,
  disabled = false,
}: PatternQuestionProps) {
  const [localSelectedOption, setLocalSelectedOption] = useState<number | number[] | null>(selectedOption);
  const [localSelectedMatching, setLocalSelectedMatching] = useState<{ [key: string]: string }>(selectedMatching);
  const [localSelectedSequence, setLocalSelectedSequence] = useState<string[]>(selectedSequence);
  const [localFilledBlanks, setLocalFilledBlanks] = useState<string[]>(filledBlanks);
  
  const pattern = question.pattern || 'single-choice';

  // Initialize local state only when the component mounts or props change significantly
  useEffect(() => {
    // Only update local state if the props are different from current state
    // This prevents infinite loops of state updates
    if (selectedOption !== null && 
        JSON.stringify(selectedOption) !== JSON.stringify(localSelectedOption)) {
      setLocalSelectedOption(selectedOption);
    }
    
    if (Object.keys(selectedMatching || {}).length > 0 && 
        JSON.stringify(selectedMatching) !== JSON.stringify(localSelectedMatching)) {
      setLocalSelectedMatching(selectedMatching || {});
    }
    
    if ((selectedSequence || []).length > 0 && 
        JSON.stringify(selectedSequence) !== JSON.stringify(localSelectedSequence)) {
      setLocalSelectedSequence(selectedSequence || []);
    }
    
    if ((filledBlanks || []).length > 0 && 
        JSON.stringify(filledBlanks) !== JSON.stringify(localFilledBlanks)) {
      setLocalFilledBlanks(filledBlanks || []);
    }
  }, [selectedOption, selectedMatching, selectedSequence, filledBlanks]);

  const handleOptionSelect = (value: string) => {
    if (disabled || revealed) return;
    
    const index = parseInt(value, 10);
    setLocalSelectedOption(index);
    onAnswer(index);
  };

  const handleMultipleChoiceSelect = (checked: boolean, index: number) => {
    if (disabled || revealed) return;
    
    let newSelected: number[] = Array.isArray(localSelectedOption) ? [...localSelectedOption] : [];
    
    if (checked) {
      newSelected.push(index);
    } else {
      newSelected = newSelected.filter(i => i !== index);
    }
    
    setLocalSelectedOption(newSelected);
    onAnswer(newSelected);
  };

  const handleMatchingSelect = (left: string, right: string) => {
    if (disabled || revealed) return;
    
    const newMatching = { ...localSelectedMatching, [left]: right };
    setLocalSelectedMatching(newMatching);
    onAnswer(newMatching);
  };

  const handleSequenceSelect = (item: string, position: number) => {
    if (disabled || revealed) return;
    
    const newSequence = [...localSelectedSequence];
    // If item already exists in sequence, remove it
    const existingIndex = newSequence.indexOf(item);
    if (existingIndex >= 0) {
      newSequence.splice(existingIndex, 1);
    }
    // Insert the item at the selected position
    newSequence.splice(position, 0, item);
    
    // Remove any undefined elements
    const cleanSequence = newSequence.filter(item => item !== undefined);
    
    setLocalSelectedSequence(cleanSequence);
    onAnswer(cleanSequence);
  };

  const handleBlankFill = (value: string, index: number) => {
    if (disabled || revealed) return;
    
    const newBlanks = [...localFilledBlanks];
    newBlanks[index] = value;
    setLocalFilledBlanks(newBlanks);
    onAnswer(newBlanks);
  };

  const renderSingleChoiceQuestion = () => {
    // Use a memoized value to prevent re-renders
    const currentValue = React.useMemo(() => {
      return localSelectedOption !== null ? localSelectedOption.toString() : undefined;
    }, [localSelectedOption]);
    
    return (
      <RadioGroup
        value={currentValue}
        onValueChange={handleOptionSelect}
        className="space-y-3"
      >
        {question.a4.map((option, index) => {
          let optionStyle = "border-border hover:border-primary";
          
          if (revealed) {
            if (option === question.an) {
              optionStyle = "border-accent bg-accent/10 text-accent-foreground";
            } else if (localSelectedOption === index) {
              optionStyle = "border-destructive bg-destructive/10 text-destructive-foreground";
            }
          }
          
          return (
            <div key={index} className={cn(
              "flex items-start space-x-2.5 p-2.5 rounded-lg border transition-all text-sm",
              optionStyle,
              revealed ? "cursor-default" : "cursor-pointer"
            )}>
              <RadioGroupItem
                value={index.toString()}
                id={`${question.id}-opt-${index}`}
                className="shrink-0 mt-0.5"
                disabled={revealed || disabled}
              />
              <Label
                htmlFor={`${question.id}-opt-${index}`}
                className="flex-1 leading-snug"
              >
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  const renderMultipleChoiceQuestion = () => (
    <div className="space-y-3">
      {question.a4.map((option, index) => {
        let optionStyle = "border-border hover:border-primary";
        
        if (revealed) {
          if (question.multipleCorrectAnswers?.includes(option)) {
            optionStyle = "border-accent bg-accent/10 text-accent-foreground";
          } else if (Array.isArray(localSelectedOption) && localSelectedOption.includes(index)) {
            optionStyle = "border-destructive bg-destructive/10 text-destructive-foreground";
          }
        }
        
        return (
          <div key={index} className={cn(
            "flex items-start space-x-2.5 p-2.5 rounded-lg border transition-all text-sm",
            optionStyle,
            revealed ? "cursor-default" : "cursor-pointer"
          )}>
            <Checkbox
              id={`${question.id}-opt-${index}`}
              className="shrink-0 mt-0.5"
              disabled={revealed || disabled}
              checked={Array.isArray(localSelectedOption) && localSelectedOption.includes(index)}
              onCheckedChange={(checked) => handleMultipleChoiceSelect(!!checked, index)}
            />
            <Label
              htmlFor={`${question.id}-opt-${index}`}
              className="flex-1 leading-snug"
            >
              {option}
            </Label>
          </div>
        );
      })}
      <Alert className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
        <AlertTitle>सूचना:</AlertTitle>
        <AlertDescription>यस प्रश्नमा एक भन्दा बढी सही उत्तरहरू छन्। सबै सही उत्तरहरू चयन गर्नुहोस्।</AlertDescription>
      </Alert>
    </div>
  );

  const renderTrueFalseQuestion = () => renderSingleChoiceQuestion(); // Same rendering as single choice

  const renderMatchingQuestion = () => {
    if (!question.matchItems) return <div>No matching items available</div>;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="font-medium text-center pb-2">वाम स्तम्भ</div>
          <div className="font-medium text-center pb-2">दाहिने स्तम्भ</div>
        </div>
        
        {question.matchItems.map((item, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-md">{item.left}</div>
            <div>
              <select 
                className="w-full p-2 border rounded-md"
                value={localSelectedMatching[item.left] || ''}
                onChange={(e) => handleMatchingSelect(item.left, e.target.value)}
                disabled={revealed || disabled}
                aria-label={`Match option for ${item.left}`}
              >
                <option value="">– चयन गर्नुहोस् –</option>
                {question.matchItems?.map((rightItem, rightIndex) => (
                  <option key={rightIndex} value={rightItem.right}>
                    {rightItem.right}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {revealed && (
          <div className="mt-4 pt-4 border-t">
            <div className="font-medium mb-2">सही उत्तरहरू:</div>
            {question.matchItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <div>{item.left}</div>
                <div className="font-medium">{item.right}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSequenceQuestion = () => {
    if (!question.correctSequence) return <div>No sequence items available</div>;
    
    // Create a copy of the sequence for displaying in a randomized order
    const availableItems = [...(question.correctSequence || [])];
    const selectedItems = [...localSelectedSequence];
    const remainingItems = availableItems.filter(item => !selectedItems.includes(item));
    
    return (
      <div className="space-y-6">
        <div>
          <h4 className="mb-2 font-medium">सही क्रममा मिलाउनुहोस्:</h4>
          <div className="space-y-2">
            {selectedItems.map((item, index) => (
              <div 
                key={`selected-${index}`}
                className="p-3 bg-gray-50 border rounded-md flex justify-between items-center"
              >
                <span>{index + 1}. {item}</span>
                {!revealed && !disabled && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newSeq = [...selectedItems];
                      newSeq.splice(index, 1);
                      setLocalSelectedSequence(newSeq);
                      onAnswer(newSeq);
                    }}
                  >
                    हटाउनुहोस्
                  </Button>
                )}
              </div>
            ))}
            
            {selectedItems.length === 0 && (
              <div className="p-3 border border-dashed rounded-md text-center text-muted-foreground">
                क्रम तय गर्न तल दिइएका विकल्पहरू छनौट गर्नुहोस्
              </div>
            )}
          </div>
        </div>
        
        {remainingItems.length > 0 && !revealed && !disabled && (
          <div>
            <h4 className="mb-2 font-medium">उपलब्ध विकल्पहरू:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {remainingItems.map((item, index) => (
                <Button
                  key={`remaining-${index}`}
                  variant="outline"
                  onClick={() => {
                    const newSeq = [...selectedItems, item];
                    setLocalSelectedSequence(newSeq);
                    onAnswer(newSeq);
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {revealed && (
          <div className="mt-4 pt-4 border-t">
            <div className="font-medium mb-2">सही क्रम:</div>
            {question.correctSequence.map((item, index) => (
              <div key={index} className="p-2 bg-accent/10 border-accent border rounded-md my-1">
                {index + 1}. {item}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderFillBlankQuestion = () => {
    if (!question.blankAnswers) return <div>No blank answers available</div>;

    // Split the question text by blanks
    const questionParts = question.qn?.split('_____') || [];
    
    return (
      <div className="space-y-4">
        <div className="rounded-md p-4 bg-muted/40">
          {questionParts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < questionParts.length - 1 && (
                <Input
                  className="inline-block w-32 mx-1"
                  value={localFilledBlanks[index] || ''}
                  onChange={(e) => handleBlankFill(e.target.value, index)}
                  disabled={revealed || disabled}
                  placeholder="___________"
                />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <RadioGroup 
          className="space-y-2 mt-4"
          value={React.useMemo(() => localSelectedOption !== null ? localSelectedOption.toString() : undefined, [localSelectedOption])}
          onValueChange={handleOptionSelect}
        >
          {question.a4.map((option, index) => {
            let optionStyle = "border-border hover:border-primary";
            
            if (revealed) {
              if (option === question.an) {
                optionStyle = "border-accent bg-accent/10 text-accent-foreground";
              } else if (localSelectedOption === index) {
                optionStyle = "border-destructive bg-destructive/10 text-destructive-foreground";
              }
            }
            
            return (
              <div key={index} className={cn(
                "flex items-start space-x-2.5 p-2.5 rounded-lg border transition-all text-sm",
                optionStyle,
                revealed ? "cursor-default" : "cursor-pointer"
              )}>
                <RadioGroupItem
                  value={index.toString()}
                  id={`${question.id}-fill-opt-${index}`}
                  className="shrink-0 mt-0.5"
                  disabled={revealed || disabled}
                />
                <Label
                  htmlFor={`${question.id}-fill-opt-${index}`}
                  className="flex-1 leading-snug"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        
        {revealed && (
          <div className="mt-4 pt-4 border-t">
            <div className="font-medium mb-2">सही उत्तर:</div>
            <div className="p-2 bg-accent/10 border-accent border rounded-md">
              {question.qn?.split('_____').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < questionParts.length - 1 && (
                    <span className="font-medium mx-0.5 px-1 bg-accent/20 rounded">
                      {question.blankAnswers?.[i] || ''}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPattern = () => {
    switch (pattern) {
      case 'multiple-choice':
        return renderMultipleChoiceQuestion();
      case 'true-false':
        return renderTrueFalseQuestion();
      case 'matching':
        return renderMatchingQuestion();
      case 'sequence':
        return renderSequenceQuestion();
      case 'fill-blank':
        return renderFillBlankQuestion();
      case 'single-choice':
      default:
        return renderSingleChoiceQuestion();
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background hover:shadow-md transition-shadow">
      <p className="text-base sm:text-lg font-semibold mb-3">
        प्रश्न {questionNumber}: {question.qn || "चित्रमा आधारित प्रश्न:"}
      </p>
      
      {question.imageUrl && (
        <div className="my-3 flex justify-center">
          <Image
            src={question.imageUrl}
            alt={`प्रश्न ${questionNumber} सम्बन्धित छवि`}
            width={250}
            height={125}
            className="rounded-md object-contain border"
            data-ai-hint="traffic scenario diagram"
          />
        </div>
      )}
      
      {renderPattern()}
      
      {revealed && (
        <Alert className={`mt-4 text-sm ${isCorrect ? 'border-accent text-accent' : 'border-destructive text-destructive'}`}>
          {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle>{isCorrect ? 'सही!' : 'गलत!'}</AlertTitle>
          {!isCorrect && pattern === 'single-choice' && (
            <AlertDescription>
              सही उत्तर हो: {question.an}
            </AlertDescription>
          )}
        </Alert>
      )}
      
      {showRevealButton && !revealed && (
        <div className="mt-4 text-right">
          <Button 
            onClick={onReveal} 
            variant="outline" 
            size="sm"
            disabled={
              (pattern === 'single-choice' && localSelectedOption === null) ||
              (pattern === 'multiple-choice' && (!Array.isArray(localSelectedOption) || localSelectedOption.length === 0)) ||
              (pattern === 'true-false' && localSelectedOption === null) ||
              (pattern === 'matching' && Object.keys(localSelectedMatching).length < (question.matchItems?.length || 0)) ||
              (pattern === 'sequence' && localSelectedSequence.length < (question.correctSequence?.length || 0)) ||
              (pattern === 'fill-blank' && (localSelectedOption === null))
            }
          >
            उत्तर जाँच्नुहोस्
          </Button>
        </div>
      )}
    </div>
  );
}
