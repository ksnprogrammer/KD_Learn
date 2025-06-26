'use client';

import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Swords, Trophy, Zap, Leaf, FlaskConical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const achievements = [
    { icon: Zap, name: "Crimson Dragon Slayer", description: "Master the realm of Physics." },
    { icon: Leaf, name: "Verdant Dragon Tamer", description: "Master the realm of Biology." },
    { icon: FlaskConical, name: "Azure Dragon Scholar", description: "Master the realm of Chemistry." },
    { icon: Shield, name: "Titan's Shield", description: "Complete a weekly challenge." },
];

function ProfileContent() {
    const user = useUser();
    
    const userName = user?.user_metadata?.name || 'Knight';
    const examLevel = user?.user_metadata?.exam_level || 'A/L';
    const userTitle = `Dragon Knight - ${examLevel} Path`;

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
                        <Badge>Level 5</Badge>
                        <Badge variant="secondary">11,500 XP</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <div className="px-6">
                        <h3 className="font-headline text-lg mb-2 text-center">Next Level Progress</h3>
                        <div className="flex items-center gap-4">
                           <span className="text-sm text-muted-foreground">LVL 5</span>
                           <Progress value={66} className="h-4" />
                           <span className="text-sm text-muted-foreground">LVL 6</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <Card>
                            <CardHeader>
                                <Trophy className="mx-auto w-8 h-8 text-primary" />
                                <CardTitle>Rank</CardTitle>
                                <CardDescription>#3</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Swords className="mx-auto w-8 h-8 text-primary" />
                                <CardTitle>Quests</CardTitle>
                                <CardDescription>42</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Shield className="mx-auto w-8 h-8 text-primary" />
                                <CardTitle>Badges</CardTitle>
                                <CardDescription>{achievements.length}</CardDescription>
                            </CardHeader>
                        </Card>
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
