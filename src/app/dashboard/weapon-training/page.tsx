import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Swords } from "lucide-react";

function WeaponTrainingContent() {
    return (
        <div className="container mx-auto py-8">
             <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                        <Swords className="w-10 h-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Weapon Training</CardTitle>
                    <CardDescription>
                        Sharpen your skills with practice quizzes. The forge of knowledge is hot, and only the sharpest blades will prevail.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground">
                        <p>Practice quizzes coming soon. Check back to test your might!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default function WeaponTrainingPage() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-dvh bg-background">
                <AppSidebar />
                <div className="relative flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <WeaponTrainingContent />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
