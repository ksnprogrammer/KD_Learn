'use client';

import { BrainCircuit, Gem, HeartHandshake, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Logo } from './logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

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
            alt="A fierce dragon silhouetted against a red sky"
            fill
            className="absolute inset-0 z-0 object-cover opacity-30"
            data-ai-hint="fantasy landscape dragon"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
            <div className="container flex flex-col items-center text-center">
              <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up">
                Forge Your Legend in Knowledge
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in-up [animation-delay:200ms]">
                Join KingDragons, the gamified learning platform where you conquer science quests, master new skills,
                and become a legendary knight of knowledge in Sri Lanka.
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
            <Card className="animate-fade-in-up [animation-delay:100ms] border-2 border-transparent hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <BrainCircuit />
                  </div>
                  <span>Summon Knowledge Dragons</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                Our King&#39;s powerful wizards can instantly forge entire learning modules, from outlines to quizzes, with a formidable AI assistant.
              </CardContent>
            </Card>
            <Card className="animate-fade-in-up [animation-delay:300ms] border-2 border-transparent hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Zap className="text-physics"/>
                  </div>
                  <span>Conquer the Sciences</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                Explore interactive quests in Biology, Chemistry, and Physics, designed to be engaging and fun.
              </CardContent>
            </Card>
            <Card className="animate-fade-in-up [animation-delay:500ms] border-2 border-transparent hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Shield />
                  </div>
                  <span>Become a Dragon Knight</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                Earn experience, level up, and prove your mettle on the leaderboards. Become the top knight in the kingdom.
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="support" className="bg-secondary/30 py-12 sm:py-20 md:py-28">
          <div className="container">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <h2 className="font-headline text-4xl font-bold tracking-tight">Enhance Your Arsenal & Support the Kingdom</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our quest is to provide the ultimate learning platform. Your support helps us forge ahead.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">
                <Card className="flex flex-col text-center items-center p-8">
                  <CardHeader>
                     <div className="rounded-full bg-primary/10 p-4 text-primary mb-4">
                        <Gem className="w-10 h-10" />
                      </div>
                    <CardTitle className="font-headline text-3xl">Premium Membership</CardTitle>
                    <CardDescription className="pt-2">
                      Unlock the full power of a Dragon Knight with exclusive quests, advanced tools, and unique rewards.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <Button size="lg" asChild>
                      <Link href="/membership">View Membership Tiers</Link>
                    </Button>
                  </CardContent>
                </Card>
                 <Card className="flex flex-col text-center items-center p-8">
                  <CardHeader>
                     <div className="rounded-full bg-primary/10 p-4 text-primary mb-4">
                        <HeartHandshake className="w-10 h-10" />
                      </div>
                    <CardTitle className="font-headline text-3xl">Donate to the Cause</CardTitle>
                    <CardDescription className="pt-2">
                        Help us maintain the kingdom&#39;s servers, develop new features, and keep the flame of knowledge burning bright for all.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                     <Button size="lg" variant="outline" asChild>
                      <Link href="/donate">Make a Donation</Link>
                    </Button>
                  </CardContent>
                </Card>
            </div>
          </div>
        </section>

      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">&copy; {new Date().getFullYear()} KingDragons. All rights reserved.</p>
          <div className="flex gap-4">
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
