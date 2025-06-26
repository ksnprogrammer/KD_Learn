'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Sword } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  gender: z.enum(['male', 'female'], {
    required_error: 'You need to select your avatar.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function KnightRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const gender = form.watch('gender');

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    toast({
      title: 'Welcome, Knight!',
      description: `Sir ${values.name}, your registration is complete. Prepare for adventure!`,
    });
    form.reset();
  }

  return (
    <div className="relative min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
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
                              data-ai-hint="male knight"
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
                              data-ai-hint="female knight"
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enlisting...' : <> <Sword className="mr-2" /> Become a Knight </>}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1080x1920.png"
          alt="Image"
          width="1080"
          height="1920"
          className="h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
          data-ai-hint="fantasy dragon"
        />
      </div>
    </div>
  );
}
