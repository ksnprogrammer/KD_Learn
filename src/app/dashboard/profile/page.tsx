'use client';

import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Swords, Trophy, Zap, Leaf, FlaskConical, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getUserStats } from "@/app/actions";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const achievements = [
    { icon: Zap, name: "Crimson Dragon Slayer", description: "Master the realm of Physics." },
    { icon: Leaf, name: "Verdant Dragon Tamer", description: "Master the realm of Biology." },
    { icon: FlaskConical, name: "Azure Dragon Scholar", description: "Master the realm of Chemistry." },
    { icon: Shield, name: "Titan's Shield", description: "Complete a weekly challenge." },
];

interface UserStats {
    xp: number;
    level: number;
    progress: number;
    questsCompleted: number;
    rank: number | 'N/A';
    activeStreak: number;
}


function ProfileContent() {
    const user = useUser();
    const { toast } = useToast();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        const { success, data, error } = await getUserStats();
        if (success && data) {
            setStats(data as UserStats);
        } else {
             toast({ variant: 'destructive', title: 'Failed to load knight statistics', description: error });
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);
    
    const userName = user?.user_metadata?.name || 'Knight';
    const examLevel = user?.user_metadata?.exam_level || 'A/L';
    const userTitle = `Dragon Knight - ${examLevel} Path`;

    const renderStatCard = (title: string, value: any, icon: React.ReactNode) => (
        <Card>
            <CardHeader>
                {icon}
                <CardTitle>{title}</CardTitle>
                <CardDescription>{value}</CardDescription>
            </CardHeader>
        </Card>
    );

    return (
        <div className="container mx-auto py-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="items-center text-center">
                    <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="dragon avatar" />
                        <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-4xl">{userName}</CardTitle>
                    <CardDescription>{userTitle}</CardDescription>
                    <div className="flex justify-center gap-2 mt-4">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-24" />
                            </>
                        ) : (
                           <>
                                <Badge>Level {stats?.level}</Badge>
                                <Badge variant="secondary">{stats?.xp.toLocaleString()} XP</Badge>
                           </>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <div className="px-6">
                        <h3 className="font-headline text-lg mb-2 text-center">Next Level Progress</h3>
                        {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">LVL {stats?.level}</span>
                                <Progress value={stats?.progress} className="h-4" />
                                <span className="text-sm text-muted-foreground">LVL {stats ? stats.level + 1 : ''}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        {isLoading ? (
                            <>
                                {renderStatCard("Rank", <Skeleton className="h-6 w-10 mx-auto" />, <Trophy className="mx-auto w-8 h-8 text-primary" />)}
                                {renderStatCard("Quests", <Skeleton className="h-6 w-10 mx-auto" />, <Swords className="mx-auto w-8 h-8 text-primary" />)}
                                {renderStatCard("Badges", <Skeleton className="h-6 w-10 mx-auto" />, <Shield className="mx-auto w-8 h-8 text-primary" />)}
                            </>
                        ) : (
                            <>
                               {renderStatCard("Rank", `#${stats?.rank}`, <Trophy className="mx-auto w-8 h-8 text-primary" />)}
                               {renderStatCard("Quests", stats?.questsCompleted, <Swords className="mx-auto w-8 h-8 text-primary" />)}
                               {renderStatCard("Badges", achievements.length, <Shield className="mx-auto w-8 h-8 text-primary" />)}
                            </>
                        )}
                    </div>
                    
                    <div>
                        <h3 className="font-headline text-2xl mb-4 text-center">Achievements</h3>
                        <TooltipProvider>
                            <div className="flex justify-center flex-wrap gap-4">
                                {achievements.map((ach, index) => (
                                    <Tooltip key={index}>
                                        <TooltipTrigger asChild>
                                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border-2 border-transparent hover:border-primary cursor-pointer transition-all">
                                                <ach.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-bold">{ach.name}</p>
                                            <p>{ach.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </TooltipProvider>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}


export default function ProfilePage() {
    return <ProfileContent />;
}
