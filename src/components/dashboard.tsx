'use client';
import { FlaskConical, Leaf, Zap, BrainCircuit, Shield } from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const quests = [
    {
        title: 'The Verdant Dragon',
        subject: 'Biology',
        description: 'Master the secrets of life, from the smallest cell to the largest ecosystem.',
        icon: Leaf,
        color: 'text-biology',
    },
    {
        title: 'The Azure Dragon',
        subject: 'Chemistry',
        description: 'Unravel the elements and reactions that form the very fabric of our world.',
        icon: FlaskConical,
        color: 'text-chemistry',
    },
    {
        title: 'The Crimson Dragon',
        subject: 'Physics',
        description: 'Command the fundamental forces of the universe, from motion to energy.',
        icon: Zap,
        color: 'text-physics',
    },
]

function KnightDashboard() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Knight's Dashboard</h1>
                <p className="text-muted-foreground">Your quests and dragons await your command.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quests.map((quest) => (
                    <Card key={quest.title} className="flex flex-col animate-fade-in-up">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <quest.icon className={`w-8 h-8 ${quest.color}`} />
                                <div>
                                    <CardTitle className="font-headline text-2xl">{quest.title}</CardTitle>
                                    <CardDescription>{quest.subject}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{quest.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Begin Quest</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}


export function Dashboard() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-dvh bg-background">
                <AppSidebar />
                <div className="relative flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <KnightDashboard />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
