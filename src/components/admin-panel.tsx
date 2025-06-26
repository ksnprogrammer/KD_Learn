'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Upload, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { CreateModuleOutput } from '@/ai/flows/create-module-from-description';
import { generateModule } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topicDescription: z.string().min(10, 'Please enter a description of at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

function AiDragonCreator() {
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
    <div className="space-y-8">
      <Card className="border-0 bg-transparent shadow-none sm:border sm:bg-card sm:shadow">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">AI Dragon Forge</CardTitle>
          <CardDescription>Describe a topic, and the Royal Wizard will forge a Knowledge Dragon.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topicDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dragon Essence (Topic)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'The process of cellular respiration and its importance to life in the kingdom.'"
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
                Forge Dragon
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>Dragon's Anatomy</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-body text-sm">{result.lessonOutline}</pre>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up [animation-delay:200ms]">
            <CardHeader>
              <CardTitle>Trial by Fire</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-body text-sm">{result.quizQuestions}</pre>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up [animation-delay:400ms]">
            <CardHeader>
              <CardTitle>Ancient Tomes</CardTitle>
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

function AssetManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Management</CardTitle>
        <CardDescription>Manage the Kingdom's visual assets.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="picture">Upload Image</Label>
            <div className="flex gap-2">
              <Input id="picture" type="file" className="flex-1" />
              <Button>
                <Upload className="mr-2" />
                Upload
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">You can upload PNG, JPG, or GIF files. Max size 5MB.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContentSubmissions() {
  const submissions = [
    { id: 1, topic: 'Mitochondria: The Powerhouse', writer: 'Scribe Elara', status: 'Pending' },
    { id: 2, topic: 'The Carbon Cycle', writer: 'Chronicler Leo', status: 'Approved' },
    { id: 3, topic: 'Basics of Electromagnetism', writer: 'Bard Finn', status: 'Rejected' },
  ];

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Submissions</CardTitle>
        <CardDescription>Review and approve content from Dragon Writers.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead className="hidden sm:table-cell">Writer</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.topic}</TableCell>
                  <TableCell className="hidden sm:table-cell">{sub.writer}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={getBadgeVariant(sub.status)}>{sub.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {sub.status === 'Pending' && (
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon">
                          <CheckCircle className="text-biology" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <XCircle className="text-physics" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminPanel() {
  return (
    <Tabs defaultValue="creator" className="w-full max-w-6xl mx-auto">
      <TabsList className="grid w-full grid-cols-3 max-w-lg">
        <TabsTrigger value="creator">Dragon Forge</TabsTrigger>
        <TabsTrigger value="assets">Asset Manager</TabsTrigger>
        <TabsTrigger value="submissions">Submissions</TabsTrigger>
      </TabsList>
      <TabsContent value="creator" className="mt-6">
        <AiDragonCreator />
      </TabsContent>
      <TabsContent value="assets" className="mt-6">
        <AssetManager />
      </TabsContent>
      <TabsContent value="submissions" className="mt-6">
        <ContentSubmissions />
      </TabsContent>
    </Tabs>
  );
}