'use client';

import { MessageSquare, Sword } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { signup } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { useToast } from '@/hooks/use-toast';

function KnightRegistrationForm() {
  const [gender, setGender] = useState('');
  const searchParams = useSearchParams();
  const { toast } = useToast();

   useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      toast({
        title: message.includes('Check your email') ? 'One Last Step!' : 'Error',
        description: message,
        variant: message.includes('Check your email') ? 'default' : 'destructive'
      });
    }
  }, [searchParams, toast]);


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
          <form action={signup} className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" placeholder="e.g. Sir Lancelot" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="knight@kingdom.com" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Number</Label>
                <Input id="phone" name="phone" placeholder="07..." required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="nic">National Identity Card (NIC)</Label>
                <Input id="nic" name="nic" placeholder="Your or your parent&apos;s NIC" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="password">Secret Word (Password)</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
                <Label>Exam Path</Label>
                <Select name="examLevel" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select your exam level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Grade 5 Scholarship">Grade 5 Scholarship</SelectItem>
                        <SelectItem value="O/L">O/L (Ordinary Level)</SelectItem>
                        <SelectItem value="A/L">A/L (Advanced Level)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-3">
              <Label>Choose Your Avatar</Label>
              <RadioGroup name="gender" required onValueChange={setGender} className="grid grid-cols-2 gap-4">
                  <Label
                    htmlFor='gender-male'
                    className={cn(
                      'flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground',
                      gender === 'male' && 'border-primary'
                    )}
                  >
                    <RadioGroupItem value="male" id="gender-male" className="sr-only" />
                    <Image
                      src="https://placehold.co/400x400.png"
                      alt="Male Knight"
                      width={80}
                      height={80}
                      className="mb-3 rounded-full"
                      data-ai-hint="male knight fantasy"
                    />
                    Male Knight
                  </Label>
                  <Label
                    htmlFor='gender-female'
                    className={cn(
                      'flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground',
                      gender === 'female' && 'border-primary'
                    )}
                  >
                     <RadioGroupItem value="female" id="gender-female" className="sr-only" />
                    <Image
                      src="https://placehold.co/400x400.png"
                      alt="Female Knight"
                      width={80}
                      height={80}
                      className="mb-3 rounded-full"
                      data-ai-hint="female knight fantasy"
                    />
                    Female Knight
                  </Label>
              </RadioGroup>
            </div>
            <div className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                <Checkbox id="terms" name="terms" required />
                <div className="space-y-1 leading-none">
                    <Label htmlFor="terms">I accept the Kingdom&apos;s rules.</Label>
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
                </div>
            </div>
            <Button type="submit" className="w-full">
                <Sword className="mr-2" /> Become a Knight
            </Button>
          </form>
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

export function KnightRegistration() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KnightRegistrationForm />
    </Suspense>
  )
}
