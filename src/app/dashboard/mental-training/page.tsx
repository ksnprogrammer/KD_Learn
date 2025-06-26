import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrainCircuit, FlaskConical, Leaf, Zap } from "lucide-react";

const coreConcepts = [
    { 
        subject: 'Physics', 
        title: "Newton's Laws of Motion", 
        icon: Zap, 
        color: 'text-physics',
        summary: "The three laws describing the relationship between a body and the forces acting upon it, and its motion in response to those forces."
    },
    { 
        subject: 'Chemistry', 
        title: "The Mole Concept", 
        icon: FlaskConical, 
        color: 'text-chemistry',
        summary: "A unit of measurement for amount of substance in the International System of Units (SI). It is defined as exactly 6.02214076×10^23 particles."
    },
    { 
        subject: 'Biology', 
        title: "Central Dogma of Molecular Biology", 
        icon: Leaf, 
        color: 'text-biology',
        summary: "An explanation of the flow of genetic information within a biological system. It is often stated as 'DNA makes RNA, and RNA makes protein'."
    }
];

function MentalTrainingContent() {
    return (
        <div className="container mx-auto py-8">
             <Card className="w-full max-w-4xl mx-auto mb-8">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                        <BrainCircuit className="w-10 h-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Mental Training</CardTitle>
                    <CardDescription>
                        Strengthen your knowledge with core concepts. A knight's mind must be as strong as their sword arm.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="w-full max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    {coreConcepts.map(concept => (
                        <AccordionItem value={concept.title} key={concept.title}>
                            <AccordionTrigger className="text-lg hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <concept.icon className={`w-6 h-6 ${concept.color}`} />
                                    {concept.title}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground pl-14">
                                {concept.summary}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
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
