
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Rocket, Code } from "lucide-react";

export function CareersPageContent() {
  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                <Wand2 className="w-10 h-10" />
            </div>
          <CardTitle className="font-headline text-3xl">Join the Wizard Team</CardTitle>
          <CardDescription className="max-w-xl mx-auto">
            We are seeking powerful developers and creative minds to join our council of wizards. Help us forge the future of learning and share in the kingdom&#39;s success.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-muted-foreground px-8 py-6">
            <div className="space-y-4">
                <h3 className="font-headline text-2xl text-card-foreground flex items-center gap-2"><Rocket /> Our Quest</h3>
                <p>
                    Our mission is to build the most engaging and effective gamified learning platform in Sri Lanka. We combine cutting-edge technology with epic storytelling to create an unforgettable educational experience for our knights.
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="font-headline text-2xl text-card-foreground flex items-center gap-2"><Code /> Who We&#39;re Looking For</h3>
                <p>
                    We seek skilled wizards proficient in the arcane arts of modern web development. If you have experience with Next.js, React, TypeScript, and a passion for creating magical user experiences, we want to hear from you. We value creativity, collaboration, and a desire to push the boundaries of what&apos;s possible.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Frontend Wizards (React, Next.js, Tailwind CSS)</li>
                    <li>Backend Sorcerers (Genkit, Firebase, Supabase)</li>
                    <li>UI/UX Enchanters (Figma, magical design skills)</li>
                </ul>
            </div>
            <div className="space-y-4">
                <h3 className="font-headline text-2xl text-card-foreground">What We Offer</h3>
                 <p>
                    Join a collaborative team where your ideas can shape the kingdom. You&apos;ll work on a meaningful project with the potential for great rewards. We offer competitive compensation and a share in the treasures we create together.
                </p>
            </div>
            <div className="text-center pt-4">
                <Button size="lg" asChild>
                    <a href="mailto:wizards@kingdragons.com">Apply to Join the Council</a>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
