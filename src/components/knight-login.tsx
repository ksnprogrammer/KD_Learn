'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Logo } from './logo';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function KnightLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    toast({
      title: 'Login Successful!',
      description: 'Welcome back to your quests, knight.',
    });
    router.push('/dashboard');
  }

  return (
    <div className="relative min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>
            <h1 className="font-headline text-3xl font-bold text-primary">Welcome Back, Knight</h1>
            <p className="text-balance text-muted-foreground">Enter your credentials to continue your journey.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entering the castle...' : <><LogIn className="mr-2" /> Log In </>}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            New to the kingdom?{' '}
            <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
              Become a Knight
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
          data-ai-hint="fantasy kingdom gate"
        />
      </div>
    </div>
  );
}
