'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { generateStory, saveStory } from "@/app/actions";
import type { CreateStoryOutput } from "@/ai/flows/create-story-flow";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Feather, Sparkles, Save } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const formSchema = z.object({
  prompt: z.string().min(5, 'Please enter a prompt of at least 5 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

function StoryWeaverPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [result, setResult] = useState<CreateStoryOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setIsSaved(false);

    const { success, data, error } = await generateStory(values.prompt);
    setIsLoading(false);

    if (success && data) {
      setResult(data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Weaving Story',
        description: error || 'The Royal Storyteller is busy. Please try again later.',
      });
    }
  }

  async function handleSaveStory() {
    if (!result) return;
    setIsSaving(true);
    const { success, error } = await saveStory(result);
    setIsSaving(false);

    if (success) {
      setIsSaved(true);
      toast({
        title: 'Story Saved!',
        description: 'Your legend has been inscribed in the Hall of Legends.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Saving Story',
        description: error || 'Could not save your story. Please try again.',
      });
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto mb-8">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
            <Feather className="w-10 h-10" />
          </div>
          <CardTitle className="font-headline text-3xl">The Story Weaver</CardTitle>
          <CardDescription>
            Provide a spark of an idea, and let the Royal Storyteller weave a new legend for the kingdom.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'A tale about the first Crimson Dragon and how it harnessed lightning.'"
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                Weave a Tale
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && !result && (
        <div className="flex flex-col items-center justify-center text-center gap-4 mt-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-headline text-lg">The storyteller is gathering inspiration...</p>
          <p className="text-muted-foreground">This may take a moment.</p>
        </div>
      )}

      {result && (
        <Card className="w-full max-w-4xl mx-auto animate-fade-in-up">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">{result.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video relative w-full rounded-lg overflow-hidden border">
                <Image
                    src={result.imageDataUri}
                    alt={result.title}
                    fill
                    className="object-cover"
                    data-ai-hint="fantasy story illustration"
                />
            </div>
            <div className="prose max-w-none text-muted-foreground leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.story}</ReactMarkdown>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveStory} disabled={isSaving || isSaved}>
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
              {isSaved ? 'Saved to Hall' : 'Save to Hall of Legends'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default function StoryWeaverPage() {
    return <StoryWeaverPanel />;
}
