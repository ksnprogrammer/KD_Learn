
'use client';

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FlaskConical, Leaf, Shield, Swords, Zap } from "lucide-react";

const liveBattle = {
    teamA: { name: 'Verdant Dragons', icon: Leaf, color: 'text-biology', score: '8,450', members: 12 },
    teamB: { name: 'Azure Dragons', icon: FlaskConical, color: 'text-chemistry', score: '8,320', members: 11 },
    timeLeft: '1h 15m remaining',
};

const battleHistory = [
    { id: 1, teams: 'Verdant Dragons vs Crimson Dragons', winner: 'Verdant Dragons', date: 'Yesterday' },
    { id: 2, teams: 'Azure Dragons vs Golden Dragons', winner: 'Golden Dragons', date: '2 days ago' },
    { id: 3, teams: 'Crimson Dragons vs Azure Dragons', winner: 'Azure Dragons', date: '4 days ago' },
    { id: 4, teams: 'The Argent Dragons vs Verdant Dragons', winner: 'The Argent Dragons', date: 'Last week' },
];


function TeamWarsDashboard() {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="font-headline text-4xl font-bold">Team Wars</h1>
                <p className="text-muted-foreground">Battle for supremacy and bring glory to your Dragon Gang!</p>
            </div>

            <Card className="bg-gradient-to-br from-card to-secondary/30 border-primary/50 border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Swords className="text-primary animate-pulse" />
                        Live Battle
                    </CardTitle>
                    <CardDescription>{liveBattle.timeLeft}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <liveBattle.teamA.icon className={`w-16 h-16 ${liveBattle.teamA.color}`} />
                        <h3 className="font-headline text-2xl">{liveBattle.teamA.name}</h3>
                        <p className="font-mono text-3xl font-bold">{liveBattle.teamA.score}</p>
                        <p className="text-sm text-muted-foreground">{liveBattle.teamA.members} Knights</p>
                    </div>
                    <div className="text-center font-headline text-5xl text-muted-foreground/50">VS</div>
                     <div className="flex flex-col items-center gap-2">
                        <liveBattle.teamB.icon className={`w-16 h-16 ${liveBattle.teamB.color}`} />
                        <h3 className="font-headline text-2xl">{liveBattle.teamB.name}</h3>
                        <p className="font-mono text-3xl font-bold">{liveBattle.teamB.score}</p>
                        <p className="text-sm text-muted-foreground">{liveBattle.teamB.members} Knights</p>
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
                                {battleHistory.map((battle) => (
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
        </div>
    );
}


export default function TeamWarsPage() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-dvh bg-background">
                <AppSidebar />
                <div className="relative flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <TeamWarsDashboard />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
