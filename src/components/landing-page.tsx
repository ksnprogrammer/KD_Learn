'use client';

import { BrainCircuit, FlaskConical, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Logo } from './logo';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Become a Knight</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative h-[80vh] min-h-[600px]">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="A fierce dragon bathed in red light"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 opacity-20 dark:grayscale"
            data-ai-hint="fierce dragon red light"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
            <div className="container flex flex-col items-center text-center">
              <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up">
                Forge Your Legend in Knowledge
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in-up [animation-delay:200ms]">
                Join KingDragons, the gamified learning platform where you conquer science quests, master new skills,
                and become a legendary knight of knowledge.
              </p>
              <div className="mt-8 animate-fade-in-up [animation-delay:400ms]">
                <Button size="lg" asChild>
                  <Link href="/register">Start Your Quest</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container py-12 sm:py-20 md:py-28">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h2 className="font-headline text-4xl font-bold tracking-tight">The Armory of a True Knight</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide you with the finest tools to conquer the realms of science.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card className="animate-fade-in-up [animation-delay:100ms]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <BrainCircuit />
                  </div>
                  <span>AI-Powered Modules</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                Instantly generate entire learning modules, from outlines to quizzes, with our powerful AI assistant.
              </CardContent>
            </Card>
            <Card className="animate-fade-in-up [animation-delay:300ms]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Zap className="text-physics"/>
                  </div>
                  <span>Master the Sciences</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                Explore interactive lessons in Biology, Chemistry, and Physics, designed to be engaging and fun.
              </CardContent>
            </Card>
            <Card className="animate-fade-in-up [animation-delay:500ms]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Shield />
                  </div>
                  <span>Rise Through the Ranks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                Earn experience, level up, and prove your mettle on the leaderboards. Become the top knight in the kingdom.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} KingDragons. All rights reserved.</p>
          <Logo />
        </div>
      </footer>
    </div>
  );
}
