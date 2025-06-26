
'use client';
import { FlaskConical, Leaf, Zap, Shield, Swords, Trophy, Target, MessageSquare, Users, BookOpen, Sigma, Send, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { getPosts, createPost, getApprovedModules } from '@/app/actions';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import type { CreateModuleOutput } from "@/ai/flows/create-module-from-description";
import Image from 'next/image';

interface ApprovedModule {
    id: number;
    topic: string;
    content: CreateModuleOutput;
    exam_level: string;
    image_data_uri: string;
}

const getSubjectInfo = (topic: string) => {
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('biolog')) return { icon: Leaf, color: 'text-biology', name: 'Biology' };
    if (lowerTopic.includes('chemis')) return { icon: FlaskConical, color: 'text-chemistry', name: 'Chemistry' };
    if (lowerTopic.includes('physic')) return { icon: Zap, color: 'text-physics', name: 'Physics' };
    if (lowerTopic.includes('math')) return { icon: Sigma, color: 'text-maths', name: 'Maths' };
    return { icon: BookOpen, color: 'text-general-science', name: 'General Science' };
}

const staticLeaderboardData = [
    { rank: 1, name: 'Sir Galahad', xp: 12500, avatar: 'https://placehold.co/100x100.png', hint: 'knight portrait' },
    { rank: 2, name: 'Lady Brienne', xp: 11800, avatar: 'https://placehold.co/100x100.png', hint: 'female knight' },
    { rank: 4, name: 'Ser Arthur', xp: 10200, avatar: 'https://placehold.co/100x100.png', hint: 'wise knight' },
    { rank: 5, name: 'Elara of the Forest', xp: 9800, avatar: 'https://placehold.co/100x100.png', hint: 'elf knight' },
];

const dailyChallenge = {
    title: 'Daily Alchemical Riddle',
    description: 'Solve a complex chemical equation within 5 minutes to earn bonus XP.',
    reward: '150 XP',
};

export function Dashboard() {
    const user = useUser();
    const { toast } = useToast();
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState('');
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [modules, setModules] = useState<ApprovedModule[]>([]);
    const [isLoadingModules, setIsLoadingModules] = useState(true);
    
    const userName = user?.user_metadata?.name || 'Knight';
    const userAvatar = 'https://placehold.co/100x100.png'; // Placeholder for now

    const leaderboardData = [
        ...staticLeaderboardData,
        { rank: 3, name: userName, xp: 11500, avatar: userAvatar, hint: 'dragon avatar' },
    ].sort((a,b) => b.xp - a.xp).map((knight, index) => ({ ...knight, rank: index + 1 }));

    const fetchPosts = useCallback(async () => {
        setIsLoadingPosts(true);
        const { success, data, error } = await getPosts();
        if (success && data) {
            setPosts(data);
        } else {
            toast({
                variant: 'destructive',
                title: 'Failed to load discussions',
                description: error || 'Could not fetch posts from the Round Table.',
            });
        }
        setIsLoadingPosts(false);
    }, [toast]);

    const fetchModules = useCallback(async () => {
        setIsLoadingModules(true);
        const { success, data, error } = await getApprovedModules();
        if (success && data) {
            setModules(data as ApprovedModule[]);
        } else {
            toast({
                variant: 'destructive',
                title: 'Failed to fetch quests',
                description: error || 'Could not load available quests.',
            });
        }
        setIsLoadingModules(false);
    }, [toast]);

    useEffect(() => {
        fetchPosts();
        fetchModules();
    }, [fetchPosts, fetchModules]);
    
    const handleAcceptChallenge = (title: string) => {
        toast({
            title: "Challenge Accepted!",
            description: `You have accepted the challenge: ${title}. Good luck, knight!`,
        });
    };

    const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newPost.trim() || !user) return;

        const originalPosts = posts;
        const tempPost = {
            id: 'temp-' + Date.now(),
            author_name: userName,
            author_avatar: userAvatar,
            created_at: new Date().toISOString(),
            content: newPost.trim(),
            isOptimistic: true,
        };
        
        setPosts([tempPost, ...posts]);
        setNewPost('');

        const { success, error } = await createPost(
            newPost.trim(),
            userName,
            userAvatar
        );

        if (success) {
            await fetchPosts();
        } else {
            setPosts(originalPosts);
            toast({
                variant: 'destructive',
                title: 'Failed to post message',
                description: error || 'Your message could not be sent. Please try again.',
            });
        }
    };
    
    const featuredQuest = modules.length > 0 ? modules[0] : null;

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="font-headline text-4xl font-bold">Welcome back, {userName}!</h1>
                <p className="text-muted-foreground">Here's your kingdom's status at a glance.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
                        <Trophy className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">#3</div>
                        <p className="text-xs text-muted-foreground">Top 1% of all knights</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quests Completed</CardTitle>
                        <Swords className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">+5 since last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Level Progress</CardTitle>
                        <Users className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">66%</div>
                        <Progress value={66} className="h-2 mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Streak</CardTitle>
                        <Zap className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12 days</div>
                        <p className="text-xs text-muted-foreground">Keep it up to earn a badge!</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                 <Card className="lg:col-span-2 relative overflow-hidden group min-h-[280px] flex flex-col justify-end bg-card">
                    {isLoadingModules ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-16 h-16 animate-spin text-primary" />
                        </div>
                    ) : featuredQuest ? (
                        <>
                            <Image
                                src={featuredQuest.image_data_uri}
                                alt={featuredQuest.topic}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out z-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
                            <div className="relative z-20 p-6 text-white">
                                <CardHeader className="p-0 mb-4">
                                    <Badge variant="secondary" className="w-fit mb-2">{featuredQuest.exam_level}</Badge>
                                    <CardTitle className="font-headline text-4xl drop-shadow-lg">
                                        {featuredQuest.topic}
                                    </CardTitle>
                                    <CardDescription className="text-primary-foreground/80">
                                        {featuredQuest.content.lessonOutline[0]?.title || 'A new challenge awaits.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Button asChild>
                                        <Link href={`/dashboard/training/${featuredQuest.id}`}>
                                            Continue Quest <ChevronRight />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground p-6 text-center">The Royal Wizards are busy forging new quests. Check back soon!</p>
                        </div>
                    )}
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
                                            <TableRow key={knight.rank} className={knight.name === userName ? 'bg-primary/10 hover:bg-primary/20' : ''}>
                                                <TableCell className="font-bold text-lg text-center">{knight.rank}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <Avatar>
                                                            <AvatarImage src={knight.avatar} data-ai-hint={knight.hint} />
                                                            <AvatarFallback>{knight.name.substring(0, 2)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{knight.name}</span>
                                                        {knight.name === userName && <Badge variant="secondary" className="ml-2">You</Badge>}
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
                    {isLoadingModules ? (
                         <div className="flex flex-col items-center justify-center text-center gap-4 mt-12">
                           <Loader2 className="w-12 h-12 animate-spin text-primary" />
                           <p className="font-headline text-lg">Gathering available quests...</p>
                       </div>
                    ) : modules.length === 0 ? (
                        <div className="text-center text-muted-foreground mt-12 max-w-md mx-auto p-6 bg-muted/50 rounded-lg">
                           <p className='font-headline text-lg text-card-foreground'>The Training Grounds are Quiet</p>
                           <p className="mt-2">No quests are available at this time. Check back later, knight!</p>
                       </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {modules.map((module) => {
                                const subject = getSubjectInfo(module.topic);
                                return (
                                    <Card key={module.id} className="flex flex-col animate-fade-in-up group hover:border-primary/50 transition-all duration-300 overflow-hidden">
                                        <CardHeader className="p-0">
                                            <div className="aspect-video relative w-full">
                                                <Image
                                                    src={module.image_data_uri}
                                                    alt={module.topic}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 flex-grow">
                                            <CardTitle className="font-headline text-lg mb-2">{module.topic}</CardTitle>
                                             <div className="flex items-center gap-2">
                                                <Badge variant="outline">{subject.name}</Badge>
                                                <Badge variant="secondary">{module.exam_level}</Badge>
                                            </div>
                                            <p className="text-muted-foreground text-sm mt-2">{module.content.quizQuestions.length} questions</p>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Button size="sm" className="w-full group-hover:bg-primary/90" asChild>
                                                <Link href={`/dashboard/training/${module.id}`}>Begin Quest</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
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
                            {isLoadingPosts ? (
                                <div className="flex flex-col items-center justify-center text-center gap-4 mt-12">
                                   <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                   <p className="font-headline text-lg">Listening for whispers from the Round Table...</p>
                               </div>
                            ) : (
                                posts.map(post => (
                                    <Card key={post.id} className={cn(post.isOptimistic && "opacity-50")}>
                                        <CardContent className="p-4 flex gap-4">
                                            <Avatar>
                                                <AvatarImage src={post.author_avatar} data-ai-hint="knight avatar" />
                                                <AvatarFallback>{post.author_name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold">{post.author_name}</p>
                                                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
                                                </div>
                                                <p className="text-muted-foreground mt-1">{post.content}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
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
