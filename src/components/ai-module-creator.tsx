'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { generateModule } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { CreateModuleOutput } from '@/ai/flows/create-module-from-description';

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
          <CardDescription>
            Describe a topic, and let our AI generate a complete learning module for you.
          </CardDescription>
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
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2" />
                )}
                Generate Module
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-8 grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>Lesson Outline</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-body text-sm">{result.lessonOutline}</pre>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up [animation-delay:200ms]">
            <CardHeader>
              <CardTitle>Quiz Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-body text-sm">{result.quizQuestions}</pre>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up [animation-delay:400ms]">
            <CardHeader>
              <CardTitle>Resource Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-body text-sm">{result.resourceSuggestions}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
