import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrainCircuit } from "lucide-react";

function MentalTrainingContent() {
    return (
        <div className="container mx-auto py-8">
             <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                        <BrainCircuit className="w-10 h-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Mental Training</CardTitle>
                    <CardDescription>
                        Strengthen your knowledge with core concepts. A knight's mind must be as strong as their sword arm.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground">
                        <p>Core concept review area coming soon. Return to fortify your knowledge base!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default function MentalTrainingPage() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-dvh bg-background">
                <AppSidebar />
                <div className="relative flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <MentalTrainingContent />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
