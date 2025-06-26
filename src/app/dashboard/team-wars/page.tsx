'use client';

import { useEffect, useState } from 'react';
import { getTeamWarData } from '@/app/actions';
import type { TeamWarReportOutput } from '@/ai/flows/generate-team-war-report';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FlaskConical, Leaf, Swords, Zap, Loader2 } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

const subjectIcons = {
    Biology: { icon: Leaf, color: 'text-biology' },
    Chemistry: { icon: FlaskConical, color: 'text-chemistry' },
    Physics: { icon: Zap, color: 'text-physics' },
};

function TeamWarsDashboard() {
    const [report, setReport] = useState<TeamWarReportOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchReport() {
            setIsLoading(true);
            const { success, data, error } = await getTeamWarData();
            if (success && data) {
                setReport(data);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Failed to fetch battle report',
                    description: error || 'The Battle Master is currently unavailable.',
                });
            }
            setIsLoading(false);
        }
        fetchReport();
    }, [toast]);

    const renderTeam = (team: TeamWarReportOutput['liveBattle']['teamA']) => {
        const { icon: Icon, color } = subjectIcons[team.subject];
        return (
            <div className="flex flex-col items-center gap-2">
                <Icon className={`w-16 h-16 ${color}`} />
                <h3 className="font-headline text-2xl">{team.name}</h3>
                <p className="font-mono text-3xl font-bold">{team.score}</p>
                <p className="text-sm text-muted-foreground">{team.members} Knights</p>
            </div>
        );
    };

    const renderLoadingState = () => (
        <>
            <Card className="bg-gradient-to-br from-card to-secondary/30 border-primary/50 border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Swords className="text-primary animate-pulse" />
                        Live Battle
                    </CardTitle>
                    <Skeleton className="h-5 w-36" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="text-center font-headline text-5xl text-muted-foreground/50">VS</div>
                    <div className="flex flex-col items-center gap-2">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Battle History</CardTitle>
                    <CardDescription>Review the outcomes of past wars.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Matchup</TableHead>
                                    <TableHead>Victor</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(4)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="font-headline text-4xl font-bold">Team Wars</h1>
                <p className="text-muted-foreground">Battle for supremacy and bring glory to your Dragon Gang!</p>
            </div>

            {isLoading && !report ? renderLoadingState() : !report ? (
                 <div className="flex flex-col items-center justify-center text-center gap-4 mt-12">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="font-headline text-lg">Contacting the Battle Master...</p>
                </div>
            ) : (
                <>
                    <Card className="bg-gradient-to-br from-card to-secondary/30 border-primary/50 border-2 animate-fade-in-up">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Swords className="text-primary animate-pulse" />
                                Live Battle
                            </CardTitle>
                            <CardDescription>{report.liveBattle.narrative} ({report.liveBattle.timeLeft})</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                            {renderTeam(report.liveBattle.teamA)}
                            <div className="text-center font-headline text-5xl text-muted-foreground/50">VS</div>
                            {renderTeam(report.liveBattle.teamB)}
                        </CardContent>
                    </Card>

                    <Card className="animate-fade-in-up [animation-delay:200ms]">
                        <CardHeader>
                            <CardTitle>Battle History</CardTitle>
                            <CardDescription>Review the outcomes of past wars.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Matchup</TableHead>
                                            <TableHead>Victor</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {report.battleHistory.map((battle) => (
                                            <TableRow key={battle.id}>
                                                <TableCell className="font-medium">{battle.teams}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{battle.winner}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">{battle.date}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}


export default function TeamWarsPage() {
    return <TeamWarsDashboard />;
}
