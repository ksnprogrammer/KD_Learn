'use client';
import { FlaskConical, Leaf, Zap, BrainCircuit, Shield, Swords, Trophy, Target, MessageSquare, Users, BookOpen, Sigma, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from './ui/input';

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
    {
        title: 'The Golden Dragon',
        subject: 'Maths',
        description: 'Conquer the language of the universe, from algebra to calculus.',
        icon: Sigma,
        color: 'text-maths',
    },
    {
        title: 'The Argent Dragon',
        subject: 'General Science',
        description: 'Explore the core principles that unite all scientific disciplines.',
        icon: BookOpen,
        color: 'text-generalScience',
    },
]

const leaderboardData = [
    { rank: 1, name: 'Sir Galahad', xp: 12500, avatar: 'https://placehold.co/100x100.png', hint: 'knight portrait' },
    { rank: 2, name: 'Lady Brienne', xp: 11800, avatar: 'https://placehold.co/100x100.png', hint: 'female knight' },
    { rank: 3, name: 'King Dragon', xp: 11500, avatar: 'https://placehold.co/100x100.png', hint: 'dragon avatar' },
    { rank: 4, name: 'Ser Arthur', xp: 10200, avatar: 'https://placehold.co/100x100.png', hint: 'wise knight' },
    { rank: 5, name: 'Elara of the Forest', xp: 9800, avatar: 'https://placehold.co/100x100.png', hint: 'elf knight' },
];

const dailyChallenge = {
    title: 'Daily Alchemical Riddle',
    description: 'Solve a complex chemical equation within 5 minutes to earn bonus XP.',
    reward: '150 XP',
};

const weeklyChallenge = {
    title: 'The Titan\'s Trial (Physics)',
    description: 'Complete the entire Newtonian Mechanics quest line this week for an exclusive badge.',
    reward: 'Titan\'s Shield Badge',
};

const trainingAreas = [
    { title: 'Weapon Training', description: 'Sharpen your skills with practice quizzes.', icon: Swords, href: '#' },
    { title: 'Mental Training', description: 'Strengthen your knowledge with core concepts.', icon: BrainCircuit, href: '#' },
    { title: 'Team Wars', description: 'Join forces with your gang and battle for glory.', icon: Users, href: '/dashboard/team-wars' },
];

const discussionPosts = [
    {
        id: 1,
        author: 'Scribe Elara',
        avatar: 'https://placehold.co/100x100.png',
        hint: 'female scholar',
        time: '2 hours ago',
        content: "I'm finding the concept of redox reactions in The Azure Dragon quest quite challenging. Any tips from fellow knights who have conquered it?"
    },
    {
        id: 2,
        author: 'Bard Finn',
        avatar: 'https://placehold.co/100x100.png',
        hint: 'male bard',
        time: '1 hour ago',
        content: "Think of it as a dance of electrons, Elara! LEO the lion says GER: Lose Electrons Oxidation, Gain Electrons Reduction. That's how I remembered it."
    },
    {
        id: 3,
        author: 'Sir Galahad',
        avatar: 'https://placehold.co/100x100.png',
        hint: 'knight portrait',
        time: '30 minutes ago',
        content: "A fine mnemonic, Bard Finn! Practice with the drills in the Mental Training area. Repetition forges the strongest neural pathways."
    },
];

function QuestsTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
    );
}

function LeaderboardTab() {
    return (
        <Card className="animate-fade-in-up">
            <CardHeader>
                <CardTitle className="font-headline">Kingdom Leaderboard</CardTitle>
                <CardDescription>See who are the mightiest Dragon Knights in the realm.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Rank</TableHead>
                                <TableHead>Knight</TableHead>
                                <TableHead className="text-right">Experience (XP)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardData.map((knight) => (
                                <TableRow key={knight.rank}>
                                    <TableCell className="font-bold text-lg text-center">{knight.rank}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={knight.avatar} data-ai-hint={knight.hint} />
                                                <AvatarFallback>{knight.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{knight.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{knight.xp.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

function ChallengesTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
            <Card className="bg-gradient-to-br from-card to-secondary/50">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Target className="text-primary" />
                        <CardTitle>Daily Challenge</CardTitle>
                    </div>
                    <CardDescription>{dailyChallenge.title}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{dailyChallenge.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Badge variant="outline">Reward: {dailyChallenge.reward}</Badge>
                    <Button>Accept</Button>
                </CardFooter>
            </Card>
            <Card className="bg-gradient-to-br from-card to-secondary/50">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Trophy className="text-primary" />
                        <CardTitle>Weekly Challenge</CardTitle>
                    </div>
                    <CardDescription>{weeklyChallenge.title}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{weeklyChallenge.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Badge variant="outline">Reward: {weeklyChallenge.reward}</Badge>
                    <Button>View Progress</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

function TrainingTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            {trainingAreas.map((area) => (
                <Card key={area.title} className="hover:border-primary/50 hover:bg-secondary/20 transition-colors flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <area.icon className="w-6 h-6 text-primary" />
                            <CardTitle className="font-headline">{area.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{area.description}</p>
                    </CardContent>
                     <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href={area.href}>Enter</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

function DiscussionsTab() {
    return (
        <div className="animate-fade-in-up space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Round Table Discussions</CardTitle>
                    <CardDescription>Share wisdom and seek guidance from your fellow knights.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input placeholder="Share your thoughts, knight..." />
                        <Button><Send /> Post</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {discussionPosts.map(post => (
                    <Card key={post.id}>
                        <CardContent className="p-4 flex gap-4">
                             <Avatar>
                                <AvatarImage src={post.avatar} data-ai-hint={post.hint} />
                                <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{post.author}</p>
                                    <p className="text-xs text-muted-foreground">{post.time}</p>
                                </div>
                                <p className="text-muted-foreground mt-1">{post.content}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}


function KnightDashboard() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Knight's Dashboard</h1>
                <p className="text-muted-foreground">Your quests and dragons await your command.</p>
            </div>
            <Tabs defaultValue="quests" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
                    <TabsTrigger value="quests"><Swords className="mr-2" />Quests</TabsTrigger>
                    <TabsTrigger value="leaderboard"><Trophy className="mr-2" />Leaderboard</TabsTrigger>
                    <TabsTrigger value="challenges"><Target className="mr-2" />Challenges</TabsTrigger>
                    <TabsTrigger value="training"><BrainCircuit className="mr-2" />Training</TabsTrigger>
                    <TabsTrigger value="discussions"><MessageSquare className="mr-2" />Discussions</TabsTrigger>
                </TabsList>
                <TabsContent value="quests"><QuestsTab /></TabsContent>
                <TabsContent value="leaderboard"><LeaderboardTab /></TabsContent>
                <TabsContent value="challenges"><ChallengesTab /></TabsContent>
                <TabsContent value="training"><TrainingTab /></TabsContent>
                <TabsContent value="discussions"><DiscussionsTab /></TabsContent>
            </Tabs>
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
