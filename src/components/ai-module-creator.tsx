'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Video, FileText, Book, MousePointerClick } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { CreateModuleOutput } from '@/ai/flows/create-module-from-description';
import { generateModule } from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  topicDescription: z.string().min(10, 'Please enter a description of at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export function AIModuleCreator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CreateModuleOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicDescription: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const { success, data, error } = await generateModule(values.topicDescription);
    setIsLoading(false);

    if (success && data) {
      setResult(data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="border-0 bg-transparent shadow-none sm:border sm:bg-card sm:shadow">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">AI Module Creator</CardTitle>
          <CardDescription>Describe a topic, and let our AI generate a complete learning module for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topicDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'An introduction to cellular respiration for high school biology students.'"
                        className="min-h-[120px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                Generate Module
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-8 space-y-8 animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Lesson Outline</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {result.lessonOutline.map((section, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg">{section.title}</AccordionTrigger>
                    <AccordionContent>
                      <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground">{section.content}</pre>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Quiz Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.quizQuestions.map((quiz, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <p className="font-semibold">
                    {index + 1}. {quiz.question}
                  </p>
                  <RadioGroup disabled className="mt-4 space-y-2">
                    {quiz.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`q${index}-opt${optIndex}`} />
                        <Label
                          htmlFor={`q${index}-opt${optIndex}`}
                          className={cn(option === quiz.correctAnswer && 'text-biology font-bold')}
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="mt-4 rounded-md bg-muted/50 p-3 text-sm">
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
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Resource Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.resourceSuggestions.map((resource, index) => (
                <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="bg-primary/10 text-primary rounded-md p-2">
                    {resource.type === 'video' && <Video className="h-6 w-6" />}
                    {resource.type === 'article' && <FileText className="h-6 w-6" />}
                    {resource.type === 'book' && <Book className="h-6 w-6" />}
                    {resource.type === 'interactive' && <MousePointerClick className="h-6 w-6" />}
                  </div>
                  <div>
                    <h4 className="font-semibold">{resource.title}</h4>
                    <p className="text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
