'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  BarChart as BarChartIcon,
  CheckCheck,
  CheckCircle,
  Eye,
  Loader2,
  Sparkles,
  Upload,
  XCircle,
  Video,
  FileText,
  Book,
  MousePointerClick,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { CreateModuleOutput } from '@/ai/flows/create-module-from-description';
import type { KingdomReportOutput } from '@/ai/flows/generate-kingdom-report';
import {
  generateModule,
  getSubmissions,
  submitModuleForReview,
  updateSubmissionStatus,
  getPayments,
  updatePaymentStatus,
  generateKingdomAnalytics,
} from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  topicDescription: z.string().min(10, 'Please enter a description of at least 10 characters.'),
  examLevel: z.enum(['Grade 5 Scholarship', 'O/L', 'A/L'], {
    required_error: 'You must select an exam level.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

function AiDragonCreator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CreateModuleOutput | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');
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
    setCurrentTopic(values.topicDescription);
    const { success, data, error } = await generateModule(values.topicDescription, values.examLevel);
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

  async function handleSubmitForReview() {
    if (!result || !currentTopic) return;

    const examLevel = form.getValues('examLevel');
    if (!examLevel) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find exam level. Please try again.',
      });
      return;
    }

    setIsSubmitting(true);
    const { success, error } = await submitModuleForReview(result, currentTopic, examLevel);
    setIsSubmitting(false);

    if (success) {
      toast({
        title: 'Success!',
        description: 'Your dragon has been submitted to the scribes for review.',
      });
      setResult(null);
      setCurrentTopic('');
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Submitting',
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
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
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="examLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select target exam" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Grade 5 Scholarship">Grade 5 Scholarship</SelectItem>
                            <SelectItem value="O/L">O/L</SelectItem>
                            <SelectItem value="A/L">A/L</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                Forge Dragon
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-8 space-y-8 animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Dragon's Anatomy (Lesson Outline)</CardTitle>
              <CardDescription>The core knowledge forged from the essence you provided.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {result.lessonOutline.map((section, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg">{section.title}</AccordionTrigger>
                    <AccordionContent>
                      <div className="prose max-w-none text-muted-foreground">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Trial by Fire (Quiz)</CardTitle>
              <CardDescription>Questions to test the mettle of any knight who dares to learn.</CardDescription>
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
                    <div className="text-muted-foreground mt-1 prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{quiz.explanation}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Ancient Tomes (Resources)</CardTitle>
              <CardDescription>Further readings and artifacts for the truly dedicated scholar.</CardDescription>
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
            <CardFooter>
              <Button onClick={handleSubmitForReview} disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Upload className="mr-2" />}
                Submit For Review
              </Button>
            </CardFooter>
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
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    const { success, data, error } = await getSubmissions();
    if (success && data) {
      setSubmissions(data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Loading Submissions',
        description: error || 'An unexpected error occurred.',
      });
      setSubmissions([]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    setIsLoading(true);
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = async (id: number, newStatus: 'Approved' | 'Rejected') => {
    const { success, error } = await updateSubmissionStatus(id, newStatus);
    if (success) {
      toast({
        title: `Submission ${newStatus}`,
        description: `The topic has been ${newStatus.toLowerCase()}.`,
      });
      fetchSubmissions();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Updating Status',
        description: error || 'An unexpected error occurred.',
      });
    }
  };

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
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead className="hidden sm:table-cell">Exam Level</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length > 0 ? (
                  submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.topic}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{sub.exam_level}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={getBadgeVariant(sub.status)}>{sub.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {sub.status === 'Pending' && (
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleStatusChange(sub.id, 'Approved')}>
                              <CheckCircle className="text-biology" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleStatusChange(sub.id, 'Rejected')}>
                              <XCircle className="text-physics" />
                              <span className="sr-only">Reject</span>
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No pending submissions.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentApprovals() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    const { success, data, error } = await getPayments();
    if (success && data) {
      setPayments(data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Loading Payments',
        description: error || 'An unexpected error occurred.',
      });
      setPayments([]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    setIsLoading(true);
    fetchPayments();
  }, [fetchPayments]);

  const handleStatusChange = async (id: number, newStatus: 'Approved' | 'Rejected') => {
    const { success, error } = await updatePaymentStatus(id, newStatus);
    if (success) {
      toast({
        title: `Payment ${newStatus}`,
        description: `The payment has been ${newStatus.toLowerCase()}.`,
      });
      fetchPayments();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Updating Status',
        description: error || 'An unexpected error occurred.',
      });
    }
  };

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
        <CardTitle>Payment Approvals</CardTitle>
        <CardDescription>Review and approve manual payments for memberships and donations.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.user_name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{payment.payment_type}</TableCell>
                      <TableCell>LKR {payment.amount}</TableCell>
                      <TableCell className="hidden sm:table-cell">{format(new Date(payment.created_at), 'yyyy-MM-dd')}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(payment.status)}>{payment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" title="View Receipt (Not Implemented)" disabled>
                            <Eye />
                            <span className="sr-only">View Receipt</span>
                          </Button>
                          {payment.status === 'Pending' && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => handleStatusChange(payment.id, 'Approved')}>
                                <CheckCircle className="text-biology" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleStatusChange(payment.id, 'Rejected')}>
                                <XCircle className="text-physics" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                 ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No pending payments.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function AnalyticsReports() {
  const [report, setReport] = useState<KingdomReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReport(null);
    const { success, data, error } = await generateKingdomAnalytics();
    setIsLoading(false);

    if (success && data) {
      setReport(data);
      toast({
        title: 'Report Generated',
        description: 'The Royal Scribe has delivered their findings.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Generate Report',
        description: error || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChartIcon />
            Kingdom Intelligence
          </CardTitle>
          <CardDescription>
            Request a new report from the Royal Scribe to understand the state of the kingdom's content pipeline.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleGenerateReport} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
            Generate Intelligence Report
          </Button>
        </CardFooter>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center gap-4 mt-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-headline text-lg">The Scribe is gathering intelligence...</p>
        </div>
      )}

      {report && (
        <div className="space-y-6 animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle>Scribe's Summary</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{report.narrativeSummary}</ReactMarkdown>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {report.keyMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{metric.metric}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-card-foreground">{metric.value}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{metric.insight}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminPanel() {
  return (
    <Tabs defaultValue="creator" className="w-full max-w-6xl mx-auto">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        <TabsTrigger value="creator">Dragon Forge</TabsTrigger>
        <TabsTrigger value="assets">Asset Manager</TabsTrigger>
        <TabsTrigger value="submissions">Submissions</TabsTrigger>
        <TabsTrigger value="approvals">
          <CheckCheck className="mr-2" />
          Approvals
        </TabsTrigger>
        <TabsTrigger value="reports">
          <BarChartIcon className="mr-2" />
          Reports
        </TabsTrigger>
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
      <TabsContent value="approvals" className="mt-6">
        <PaymentApprovals />
      </TabsContent>
      <TabsContent value="reports" className="mt-6">
        <AnalyticsReports />
      </TabsContent>
    </Tabs>
  );
}
