'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  BarChart as BarChartIcon,
  CheckCheck,
  CheckCircle,
  DollarSign,
  Eye,
  Loader2,
  Sparkles,
  Upload,
  Users,
  XCircle,
  Video,
  FileText,
  Book,
  MousePointerClick,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { CreateModuleOutput } from '@/ai/flows/create-module-from-description';
import { generateModule } from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
                      <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground">{section.content}</pre>
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
  const [submissions, setSubmissions] = useState([
    { id: 1, topic: 'Mitochondria: The Powerhouse', writer: 'Scribe Elara', status: 'Pending' },
    { id: 2, topic: 'The Carbon Cycle', writer: 'Chronicler Leo', status: 'Approved' },
    { id: 3, topic: 'Basics of Electromagnetism', writer: 'Bard Finn', status: 'Rejected' },
    { id: 4, topic: 'Trigonometric Identities', writer: 'Calculator Cassian', status: 'Pending' },
  ]);

  const handleStatusChange = (id: number, newStatus: 'Approved' | 'Rejected') => {
    setSubmissions(submissions.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub)));
    toast({
      title: `Submission ${newStatus}`,
      description: `The topic has been ${newStatus.toLowerCase()}.`,
    });
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentApprovals() {
  const { toast } = useToast();
  const [payments, setPayments] = useState([
    {
      id: 1,
      user: 'Sir Lancelot',
      type: 'Membership (Dragon Knight)',
      amount: 'LKR 999',
      date: '2024-07-28',
      status: 'Pending',
    },
    { id: 2, user: 'Lady Brienne', type: 'Donation', amount: 'LKR 2500', date: '2024-07-28', status: 'Pending' },
    { id: 3, user: 'Bard Finn', type: 'Membership (Squire)', amount: 'LKR 499', date: '2024-07-27', status: 'Approved' },
  ]);

  const handleStatusChange = (id: number, newStatus: 'Approved' | 'Rejected') => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    toast({
      title: `Payment ${newStatus}`,
      description: `The payment has been ${newStatus.toLowerCase()}.`,
    });
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.user}</TableCell>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(payment.status)}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" title="View Receipt (Not Implemented)">
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsReports() {
  const newKnightsData = [
    { month: 'Jan', knights: 18 },
    { month: 'Feb', knights: 30 },
    { month: 'Mar', knights: 45 },
    { month: 'Apr', knights: 60 },
    { month: 'May', knights: 55 },
    { month: 'Jun', knights: 78 },
  ];

  const knightsChartConfig = {
    knights: {
      label: 'New Knights',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  const revenueData = [
    { month: 'Jan', revenue: 8000 },
    { month: 'Feb', revenue: 12000 },
    { month: 'Mar', revenue: 19000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 22000 },
    { month: 'Jun', revenue: 31000 },
  ];

  const revenueChartConfig = {
    revenue: {
      label: 'Revenue (LKR)',
      color: 'hsl(var(--biology))',
    },
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users />
            New Knight Enlistment
          </CardTitle>
          <CardDescription>Monthly new knights joining the kingdom.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={knightsChartConfig} className="h-[300px] w-full">
            <RechartsBarChart accessibilityLayer data={newKnightsData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="knights" fill="var(--color-knights)" radius={4} />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign />
            Kingdom Treasury
          </CardTitle>
          <CardDescription>Monthly revenue from memberships and donations.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
            <LineChart accessibilityLayer data={revenueData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickFormatter={(value) => `LKR ${Number(value) / 1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={true} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminPanel() {
  return (
    <Tabs defaultValue="creator" className="w-full max-w-6xl mx-auto">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 max-w-2xl">
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
