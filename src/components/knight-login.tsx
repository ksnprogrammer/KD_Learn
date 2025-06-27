'use client';

import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { login } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Logo } from './logo';

function KnightLoginForm() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      const isInfo = message.includes('Check your email');
      toast({
        variant: isInfo ? 'default' : 'destructive',
        title: isInfo ? 'Check Your Inbox' : 'Authentication Error',
        description: message,
      });
    }
  }, [searchParams, toast]);

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
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" placeholder="knight@kingdom.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Secret Word (Password)</Label>
              <Input type="password" id="password" name="password" required />
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2" /> Log In
            </Button>
          </form>
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

export function KnightLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KnightLoginForm />
    </Suspense>
  )
}
