
'use client';
import { FlaskConical, Leaf, Zap, BrainCircuit, Shield, Swords, Trophy, Target, MessageSquare, Users, BookOpen, Sigma, Send, ChevronRight } from 'lucide-react';
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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

const initialDiscussionPosts = [
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

const featuredQuest = quests[0];

function KnightDashboard() {
    const { toast } = useToast();
    const [posts, setPosts] = useState(initialDiscussionPosts);
    const [newPost, setNewPost] = useState('');

    const handleBeginQuest = (questTitle: string) => {
        toast({
            title: "Quest Not Yet Forged",
            description: `The quest '${questTitle}' is still being prepared by the Royal Wizards. Check back soon!`,
        });
    };
    
    const handleAcceptChallenge = (title: string) => {
        toast({
            title: "Challenge Accepted!",
            description: `You have accepted the challenge: ${title}. Good luck, knight!`,
        });
    };

    const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const newPostData = {
            id: posts.length + 1,
            author: 'King Dragon',
            avatar: 'https://placehold.co/100x100.png',
            hint: 'dragon avatar',
            time: 'Just now',
            content: newPost.trim(),
        };

        setPosts([newPostData, ...posts]);
        setNewPost('');
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="font-headline text-4xl font-bold">Welcome back, King Dragon!</h1>
                <p className="text-muted-foreground">Here's your kingdom's status at a glance.</p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Featured Quest</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-center gap-6">
                       <featuredQuest.icon className={`w-24 h-24 sm:w-32 sm:h-32 ${featuredQuest.color} shrink-0`} />
                       <div className="space-y-3 text-center sm:text-left">
                           <h3 className="font-headline text-3xl">{featuredQuest.title}</h3>
                           <p className="text-muted-foreground">{featuredQuest.description}</p>
                       </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full sm:w-auto" onClick={() => handleBeginQuest(featuredQuest.title)}>
                            Continue Quest <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col">
                     <CardHeader>
                        <div className="flex items-center gap-3">
                            <Target className="text-primary" />
                            <CardTitle>Daily Challenge</CardTitle>
                        </div>
                        <CardDescription>{dailyChallenge.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{dailyChallenge.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Badge variant="outline">Reward: {dailyChallenge.reward}</Badge>
                        <Button size="sm" onClick={() => handleAcceptChallenge(dailyChallenge.title)}>Accept</Button>
                    </CardFooter>
                </Card>
            </div>

            <Tabs defaultValue="leaderboard" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 mb-6">
                    <TabsTrigger value="leaderboard"><Trophy className="mr-2" />Leaderboard</TabsTrigger>
                    <TabsTrigger value="quests"><Swords className="mr-2" />All Quests</TabsTrigger>
                    <TabsTrigger value="discussions"><MessageSquare className="mr-2" />Discussions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="leaderboard">
                     <Card className="animate-fade-in-up">
                        <CardContent className="p-0">
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
                                            <TableRow key={knight.rank} className={knight.name === 'King Dragon' ? 'bg-primary/10 hover:bg-primary/20' : ''}>
                                                <TableCell className="font-bold text-lg text-center">{knight.rank}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <Avatar>
                                                            <AvatarImage src={knight.avatar} data-ai-hint={knight.hint} />
                                                            <AvatarFallback>{knight.name.substring(0, 2)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{knight.name}</span>
                                                        {knight.name === 'King Dragon' && <Badge variant="secondary" className="ml-2">You</Badge>}
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
                </TabsContent>
                
                <TabsContent value="quests">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {quests.map((quest) => (
                            <Card key={quest.title} className="flex flex-col animate-fade-in-up group hover:border-primary/50 transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <quest.icon className={`w-8 h-8 ${quest.color} group-hover:scale-110 transition-transform`} />
                                        <div>
                                            <CardTitle className="font-headline text-xl">{quest.title}</CardTitle>
                                            <CardDescription>{quest.subject}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground text-sm">{quest.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button size="sm" className="w-full group-hover:bg-primary/90" onClick={() => handleBeginQuest(quest.title)}>Begin Quest</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                
                <TabsContent value="discussions">
                    <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline">Round Table Discussions</CardTitle>
                                    <CardDescription>Share wisdom and seek guidance from your fellow knights.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePostSubmit} className="flex flex-col sm:flex-row gap-2">
                                        <Input 
                                            placeholder="Share your thoughts, knight..." 
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                        />
                                        <Button type="submit" className="w-full sm:w-auto"><Send /> Post</Button>
                                    </form>
                                </CardContent>
                            </Card>
                            {posts.map(post => (
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
                        <div className="lg:col-span-1">
                            <Card className="bg-gradient-to-br from-card to-secondary/30">
                                <CardHeader>
                                    <CardTitle className="font-headline">Join the Royal Conversation!</CardTitle>
                                    <CardDescription>Connect with fellow knights on our official WhatsApp channel.</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || '#'}>
                                            <MessageSquare className="mr-2" />
                                            Join WhatsApp Channel
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
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
