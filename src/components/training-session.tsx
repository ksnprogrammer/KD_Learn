'use client';

import { useState } from 'react';
import type { CreateModuleOutput, QuizQuestion } from '@/ai/flows/create-module-from-description';
import { generateAudio, recordQuestCompletion } from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle, Swords, Target, ThumbsUp, XCircle, Volume2, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/hooks/use-toast';

interface TrainingSessionProps {
  module: CreateModuleOutput;
  submissionId: number;
}

type UserAnswers = {
  [questionIndex: number]: string;
};

type AudioState = {
  isLoading: boolean;
  audioData: string | null;
};

export function TrainingSession({ module, submissionId }: TrainingSessionProps) {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [audioStates, setAudioStates] = useState<{ [index: number]: AudioState }>({});
  const { toast } = useToast();

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    let correctAnswers = 0;
    module.quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setIsSubmitted(true);
    
    const result = await recordQuestCompletion(submissionId, correctAnswers, module.quizQuestions.length);
    if (result.success) {
      if (result.message) { // Already completed
         toast({
            title: "Already Completed",
            description: `You have already earned credit for this quest.`,
        });
      } else {
        toast({
            title: "Victory!",
            description: `Your progress has been recorded. You earned ${result.xpGained} XP!`,
        });
      }
    } else {
        toast({
            variant: "destructive",
            title: "Recording Failed",
            description: result.error || "Could not save your quest progress.",
        });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see results
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };
  
  const handleListen = async (index: number, text: string) => {
    // If audio is already loaded or loading, do nothing
    if (audioStates[index]?.isLoading || audioStates[index]?.audioData) {
      return;
    }

    setAudioStates(prev => ({ ...prev, [index]: { isLoading: true, audioData: null } }));

    const { success, data, error } = await generateAudio(text);

    if (success && data) {
      setAudioStates(prev => ({ ...prev, [index]: { isLoading: false, audioData: data.media } }));
    } else {
      setAudioStates(prev => ({ ...prev, [index]: { isLoading: false, audioData: null } }));
      toast({
        variant: 'destructive',
        title: 'Could not generate audio',
        description: error || 'The Dragon could not speak at this time.',
      });
    }
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
                    <div className="text-muted-foreground mt-1 prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{quiz.explanation}</ReactMarkdown>
                    </div>
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
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Target /> Dragon&#39;s Anatomy (Lesson)</CardTitle>
          <CardDescription>Study this knowledge before your trial.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {module.lessonOutline.map((section, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg">{section.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="prose max-w-none text-muted-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      {audioStates[index]?.isLoading ? (
                        <Button variant="outline" disabled>
                          <Loader2 className="mr-2 animate-spin" />
                          Summoning Voice...
                        </Button>
                      ) : audioStates[index]?.audioData ? (
                        <audio controls src={audioStates[index]?.audioData} className="w-full max-w-sm"></audio>
                      ) : (
                        <Button variant="outline" onClick={() => handleListen(index, section.content)}>
                          <Volume2 className="mr-2" />
                          Listen to this section
                        </Button>
                      )}
                    </div>
                  </div>
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
