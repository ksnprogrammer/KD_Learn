'use client';

import { useState } from 'react';
import type { CreateModuleOutput, QuizQuestion } from '@/ai/flows/create-module-from-description';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle, Swords, Target, ThumbsUp, XCircle } from 'lucide-react';
import { Progress } from './ui/progress';

interface TrainingSessionProps {
  module: CreateModuleOutput;
}

type UserAnswers = {
  [questionIndex: number]: string;
};

export function TrainingSession({ module }: TrainingSessionProps) {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    module.quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see results
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const getResultIcon = (question: QuizQuestion, index: number) => {
    if (!isSubmitted) return null;

    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) {
      return <CheckCircle className="text-biology w-5 h-5" />;
    }
    return <XCircle className="text-physics w-5 h-5" />;
  };

  if (isSubmitted) {
    const percentage = Math.round((score / module.quizQuestions.length) * 100);
    return (
        <Card className="w-full max-w-4xl mx-auto animate-fade-in-up">
            <CardHeader className="text-center items-center">
                <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                    <ThumbsUp className="w-10 h-10" />
                </div>
                <CardTitle className="font-headline text-3xl">Trial Complete!</CardTitle>
                <CardDescription>You scored {score} out of {module.quizQuestions.length}</CardDescription>
                <div className='w-full max-w-sm pt-4'>
                    <Progress value={percentage} className="h-4" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <CardDescription className="text-center">Review your answers below.</CardDescription>
                {module.quizQuestions.map((quiz, index) => (
                <div key={index} className="rounded-lg border p-4">
                    <p className="font-semibold flex items-center gap-2">
                        {getResultIcon(quiz, index)}
                        {index + 1}. {quiz.question}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 pl-7">Your answer: <span className={cn(userAnswers[index] === quiz.correctAnswer ? "text-biology font-semibold" : "text-physics font-semibold")}>{userAnswers[index] || "Not answered"}</span></p>
                    <div className="mt-4 rounded-md bg-muted/50 p-3 text-sm ml-7">
                    <p>
                        <span className="font-semibold">Correct Answer:</span> {quiz.correctAnswer}
                    </p>
                    <p className="text-muted-foreground mt-1">
                        <span className="font-semibold">Explanation:</span> {quiz.explanation}
                    </p>
                    </div>
                </div>
                ))}
            </CardContent>
            <CardFooter>
                 <Button onClick={resetQuiz}>Attempt Trial Again</Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Target /> Dragon's Anatomy (Lesson)</CardTitle>
          <CardDescription>Study this knowledge before your trial.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {module.lessonOutline.map((section, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg">{section.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Swords /> Trial by Fire (Quiz)</CardTitle>
          <CardDescription>Answer all questions to prove your mastery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {module.quizQuestions.map((quiz, index) => (
            <div key={index} className="rounded-lg border p-4">
              <p className="font-semibold">
                {index + 1}. {quiz.question}
              </p>
              <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)} className="mt-4 space-y-2">
                {quiz.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`q${index}-opt${optIndex}`} />
                    <Label htmlFor={`q${index}-opt${optIndex}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </CardContent>
        <CardFooter>
            <Button onClick={handleSubmit} className="w-full sm:w-auto" disabled={Object.keys(userAnswers).length !== module.quizQuestions.length}>Complete Trial</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
