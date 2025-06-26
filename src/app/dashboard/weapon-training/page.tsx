'use client';

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { FlaskConical, Leaf, Swords, Zap } from "lucide-react";

const practiceQuizzes = [
  { subject: 'Biology', title: 'Cellular Structures', icon: Leaf, color: 'text-biology', questions: 15 },
  { subject: 'Chemistry', title: 'Periodic Table Basics', icon: FlaskConical, color: 'text-chemistry', questions: 20 },
  { subject: 'Physics', title: 'Kinematics Fundamentals', icon: Zap, color: 'text-physics', questions: 18 },
  { subject: 'Biology', title: 'Photosynthesis', icon: Leaf, color: 'text-biology', questions: 12 },
];


function WeaponTrainingContent() {
    const { toast } = useToast();

    const handleStartTraining = (quizTitle: string) => {
        toast({
            title: "Training Session Starting!",
            description: `Preparing the '${quizTitle}' practice quiz. Ready your mind, knight!`,
        });
    };

    return (
        <div className="container mx-auto py-8">
             <Card className="w-full max-w-4xl mx-auto mb-8">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                        <Swords className="w-10 h-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Weapon Training</CardTitle>
                    <CardDescription>
                        Sharpen your skills with practice quizzes. The forge of knowledge is hot, and only the sharpest blades will prevail.
                    </CardDescription>
                </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {practiceQuizzes.map((quiz) => (
                    <Card key={quiz.title} className="hover:border-primary/50 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">{quiz.title}</CardTitle>
                            <quiz.icon className={`w-6 h-6 ${quiz.color}`} />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{quiz.subject} &middot; {quiz.questions} questions</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleStartTraining(quiz.title)}>Start Training</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}


export default function WeaponTrainingPage() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-dvh bg-background">
                <AppSidebar />
                <div className="relative flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <WeaponTrainingContent />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
