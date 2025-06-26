
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Swords, Trophy } from "lucide-react";

function ProfileContent() {
    return (
        <div className="container mx-auto py-8">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="dragon avatar" />
                        <AvatarFallback>KD</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-4xl">King Dragon</CardTitle>
                    <CardDescription>Dragon Knight of the Azure Gang</CardDescription>
                    <div className="flex justify-center gap-2 mt-2">
                        <Badge>Level 5</Badge>
                        <Badge variant="secondary">11,500 XP</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-headline text-lg mb-2">Next Level Progress</h3>
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
                                <CardDescription>8</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default function ProfilePage() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-dvh bg-background">
                <AppSidebar />
                <div className="relative flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <ProfileContent />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
