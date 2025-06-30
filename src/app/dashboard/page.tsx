
'use client';
import { FlaskConical, Leaf, Zap, Shield, Swords, Trophy, Target, MessageSquare, Users, BookOpen, Sigma, Send, ChevronRight, Loader2, CheckCircle, XCircle } from 'lucide-react';
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
import { getPosts, createPost, getDailyChallenge, getUserStats, getLeaderboard, submitDailyChallengeAnswer } from '@/app/actions';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import type { CreateModuleOutput } from "@/ai/flows/create-module-from-description";
import type { DailyChallengeOutput } from '@/ai/schemas/daily-challenge';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AIChat } from '@/components/ai-chat';
import { Textarea } from '@/components/ui/textarea';

interface ApprovedModule {
    id: number;
    topic: string;
    content: CreateModuleOutput;
    exam_level: string;
    image_data_uri: string;
}

interface UserStats {
    xp: number;
    level: number;
    progress: number;
    questsCompleted: number;
    rank: number | 'N/A';
    activeStreak: number;
}

const getSubjectInfo = (topic: string) => {
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('biolog')) return { icon: Leaf, color: 'text-biology', name: 'Biology' };
    if (lowerTopic.includes('chemis')) return { icon: FlaskConical, color: 'text-chemistry', name: 'Chemistry' };
    if (lowerTopic.includes('physic')) return { icon: Zap, color: 'text-physics', name: 'Physics' };
    if (lowerTopic.includes('math')) return { icon: Sigma, color: 'text-maths', name: 'Maths' };
    return { icon: BookOpen, color: 'text-general-science', name: 'General Science' };
}

export default function Dashboard() {
    const user = useUser();
    const { toast } = useToast();
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState('');
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [modules, setModules] = useState<ApprovedModule[]>([]);
    const [isLoadingModules, setIsLoadingModules] = useState(true);
    const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeOutput | null>(null);
    const [isLoadingChallenge, setIsLoadingChallenge] = useState(true);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

    // State for the daily challenge dialog
    const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false);
    const [challengeAnswer, setChallengeAnswer] = useState('');
    const [isSubmittingChallenge, setIsSubmittingChallenge] = useState(false);
    const [challengeResult, setChallengeResult] = useState<{isCorrect: boolean; explanation: string} | null>(null);


    const userName = user?.user_metadata?.name || 'Knight';
    const userAvatar = user?.user_metadata?.avatar_url || 'https://placehold.co/100x100.png';
    const userAvatarHint = user?.user_metadata?.avatar_hint || 'knight avatar';

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
        // Since getApprovedModules is commented out in actions.ts, we'll just set modules to an empty array
        setModules([]);
        toast({
            variant: 'default',
            title: 'Training Modules Unavailable',
            description: 'The Royal Wizards are currently forging new Knowledge Dragons. Check back soon!',
        });
        setIsLoadingModules(false);
    }, [toast]);

    const fetchChallenge = useCallback(async () => {
        setIsLoadingChallenge(true);
        const { success, data, error } = await getDailyChallenge();
        if (success && data) {
            setDailyChallenge(data);
        } else {
            setDailyChallenge({
                category: 'Riddle',
                title: "The Challenge Master's Day Off",
                description: "The realm is quiet today. A perfect time to review your past quests! The Challenge Master will return tomorrow with a new trial.",
                reward: 'Priceless Wisdom'
            } as DailyChallengeOutput);
            toast({
                variant: 'default',
                title: 'Daily Challenge Unavailable',
                description: error || 'Could not fetch the daily challenge.',
            });
        }
        setIsLoadingChallenge(false);
    }, [toast]);

    const fetchStats = useCallback(async () => {
        setIsLoadingStats(true);
        const { success, data, error } = await getUserStats();
        if (success && data) {
            setStats(data as UserStats);
        } else {
             toast({ variant: 'destructive', title: 'Failed to load stats', description: error });
        }
        setIsLoadingStats(false);
    }, [toast]);

    const fetchLeaderboard = useCallback(async () => {
        setIsLoadingLeaderboard(true);
        const { success, data, error } = await getLeaderboard();
        if (success && data) {
            setLeaderboard(data);
        } else {
            toast({ variant: 'destructive', title: 'Failed to load leaderboard', description: error });
        }
        setIsLoadingLeaderboard(false);
    }, [toast]);

    useEffect(() => {
        fetchPosts();
        fetchModules();
        fetchChallenge();
        fetchStats();
        fetchLeaderboard();
    }, [fetchPosts, fetchModules, fetchChallenge, fetchStats, fetchLeaderboard]);
    
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

        const { success, error } = await createPost(newPost.trim());

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
    
    const handleChallengeSubmit = async () => {
        if (!challengeAnswer.trim() || !dailyChallenge) return;
        setIsSubmittingChallenge(true);
        setChallengeResult(null);

        const { success, data, error } = await submitDailyChallengeAnswer(dailyChallenge, challengeAnswer);
        setIsSubmittingChallenge(false);

        if (success && data) {
            setChallengeResult(data);
            if (data.isCorrect) {
                // Re-fetch stats after a short delay to allow database to update
                setTimeout(() => fetchStats(), 1000);
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Failed to submit answer',
                description: error,
            });
        }
    };

    const resetChallengeDialog = () => {
        setChallengeAnswer('');
        setChallengeResult(null);
        setIsSubmittingChallenge(false);
    }

    const featuredQuest = modules.length > 0 ? modules[0] : null;

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="font-headline text-4xl font-bold">Welcome back, {userName}!</h1>
                <p className="text-muted-foreground">Here&apos;s your kingdom&apos;s status at a glance.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
                        <Trophy className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingStats ? <Skeleton className='h-8 w-1/2' /> : <div className="text-3xl font-bold">#{stats?.rank}</div>}
                        <p className="text-xs text-muted-foreground">on the leaderboard</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quests Completed</CardTitle>
                        <Swords className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingStats ? <Skeleton className='h-8 w-1/4' /> : <div className="text-3xl font-bold">{stats?.questsCompleted}</div>}
                        <p className="text-xs text-muted-foreground">total quests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Level Progress</CardTitle>
                        <Users className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingStats ? (
                            <>
                                <Skeleton className='h-8 w-1/3 mb-2' />
                                <Skeleton className='h-2 w-full' />
                            </>
                        ) : (
                            <>
                                <div className="text-3xl font-bold">{stats?.progress}%</div>
                                <Progress value={stats?.progress} className="h-2 mt-2" />
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Streak</CardTitle>
                        <Zap className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingStats ? <Skeleton className='h-8 w-1/2' /> : <div className="text-3xl font-bold">{stats?.activeStreak} days</div>}
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
                        {isLoadingChallenge ? (
                            <Skeleton className="h-5 w-3/4 mt-1" />
                        ) : (
                            <CardDescription>{dailyChallenge?.title}</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="flex-grow">
                        {isLoadingChallenge ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ) : (
                            <p className="text-muted-foreground">{dailyChallenge?.description}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        {isLoadingChallenge ? (
                             <Skeleton className="h-6 w-24" />
                        ) : (
                            <Badge variant="outline">Reward: {dailyChallenge?.reward}</Badge>
                        )}
                        <Dialog open={isChallengeDialogOpen} onOpenChange={(open) => {
                            setIsChallengeDialogOpen(open);
                            if (!open) {
                                resetChallengeDialog();
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button size="sm" disabled={isLoadingChallenge}>Accept</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="font-headline text-2xl">{dailyChallenge?.title}</DialogTitle>
                                    <DialogDescription>{dailyChallenge?.description}</DialogDescription>
                                </DialogHeader>
                                {!challengeResult ? (
                                    <div className="space-y-4 pt-4">
                                        <Textarea
                                            placeholder="Your answer..."
                                            value={challengeAnswer}
                                            onChange={(e) => setChallengeAnswer(e.target.value)}
                                            rows={4}
                                        />
                                        <DialogFooter>
                                            <Button onClick={handleChallengeSubmit} disabled={isSubmittingChallenge || !challengeAnswer.trim()}>
                                                {isSubmittingChallenge && <Loader2 className="mr-2 animate-spin" />}
                                                Submit Answer
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                ) : (
                                    <div className="space-y-4 pt-4">
                                        <Card className={cn(challengeResult.isCorrect ? "bg-primary/10 border-primary/50" : "bg-destructive/10 border-destructive/50")}>
                                            <CardHeader>
                                                 <CardTitle className={cn("flex items-center gap-2", challengeResult.isCorrect ? "text-primary" : "text-destructive")}>
                                                    {challengeResult.isCorrect ? <CheckCircle /> : <XCircle />}
                                                    {challengeResult.isCorrect ? "Victory!" : "A Valiant Effort!"}
                                                </CardTitle>
                                                <CardDescription className="pt-2 text-card-foreground">{challengeResult.explanation}</CardDescription>
                                            </CardHeader>
                                             {challengeResult.isCorrect && (
                                                <CardContent>
                                                    <p className="text-sm font-semibold text-primary">You&apos;ve been awarded {dailyChallenge?.reward}!</p>
                                                </CardContent>
                                            )}
                                        </Card>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="secondary">Close</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
                <AIChat />
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
                                        {isLoadingLeaderboard ? (
                                            [...Array(5)].map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-6 w-4" /></TableCell>
                                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                                    <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            leaderboard.map((knight) => (
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
                                            ))
                                        )}
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
