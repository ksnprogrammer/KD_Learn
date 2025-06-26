'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare, Sword } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  phone: z.string().min(9, { message: 'Please enter a valid phone number.' }),
  nic: z.string().min(10, { message: 'Please enter a valid NIC number (10-12 characters).' }).max(12),
  examLevel: z.enum(['scholarship', 'ol', 'al'], {
    required_error: 'Please select your exam level.',
  }),
  gender: z.enum(['male', 'female'], {
    required_error: 'You need to select your avatar.',
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions to proceed.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function KnightRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      nic: '',
      terms: false,
    },
  });

  const gender = form.watch('gender');

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    const gang = values.gender === 'male' ? 'the Azure Dragons' : 'the Verdant Dragons';

    toast({
      title: 'Welcome, Knight!',
      description: `Sir ${values.name}, you have been initiated into ${gang}. Prepare for adventure!`,
    });
    router.push('/dashboard');
  }

  return (
    <div className="relative min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="grid gap-2 text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>
            <h1 className="font-headline text-3xl font-bold text-primary">Become a Knight</h1>
            <p className="text-balance text-muted-foreground">
              Join the ranks of the King Dragons and start your epic journey today.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sir Lancelot" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="knight@kingdom.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input placeholder="07..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="nic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National Identity Card (NIC)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your or your parent's NIC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Word (Password)</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="examLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Path</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your exam level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="scholarship">Grade 5 Scholarship</SelectItem>
                          <SelectItem value="ol">O/L (Ordinary Level)</SelectItem>
                          <SelectItem value="al">A/L (Advanced Level)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Choose Your Avatar</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="male" className="sr-only" />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              'flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground',
                              gender === 'male' && 'border-primary'
                            )}
                          >
                            <Image
                              src="https://placehold.co/400x400.png"
                              alt="Male Knight"
                              width={80}
                              height={80}
                              className="mb-3 rounded-full"
                              data-ai-hint="male knight fantasy"
                            />
                            Male Knight
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="female" className="sr-only" />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              'flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground',
                              gender === 'female' && 'border-primary'
                            )}
                          >
                            <Image
                              src="https://placehold.co/400x400.png"
                              alt="Female Knight"
                              width={80}
                              height={80}
                              className="mb-3 rounded-full"
                              data-ai-hint="female knight fantasy"
                            />
                            Female Knight
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I accept the Kingdom's rules.</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        By signing up, you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-primary" target="_blank">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="underline hover:text-primary" target="_blank">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enlisting...' : <> <Sword className="mr-2" /> Become a Knight </>}
              </Button>
            </form>
          </Form>
          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || '#'}>
                <MessageSquare className="mr-2" /> Join the WhatsApp Channel
              </Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1080x1920.png"
          alt="Image"
          width="1080"
          height="1920"
          className="h-full w-full object-cover dark:brightness-[0.3]"
          data-ai-hint="fantasy dragon crest"
        />
      </div>
    </div>
  );
}
