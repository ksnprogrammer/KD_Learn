'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Swords, Zap, FlaskConical, Leaf, BookOpen, Sigma } from "lucide-react";
import { useEffect, useState } from "react";
import { getApprovedModules } from "@/app/actions";
import Link from "next/link";
import type { CreateModuleOutput } from "@/ai/flows/create-module-from-description";
import { Badge } from "@/components/ui/badge";
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


function WeaponTrainingContent() {
    const { toast } = useToast();
    const [modules, setModules] = useState<ApprovedModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            setIsLoading(true);
            const { success, data, error } = await getApprovedModules();
            if (success && data) {
                setModules(data as ApprovedModule[]);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Failed to fetch training modules',
                    description: error || 'Could not load available quests.',
                });
            }
            setIsLoading(false);
        };

        fetchModules();
    }, [toast]);


    return (
        <div className="container mx-auto py-8">
             <Card className="w-full max-w-4xl mx-auto mb-8">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                        <Swords className="w-10 h-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Weapon Training</CardTitle>
                    <CardDescription>
                        Sharpen your skills with practice quizzes. The forge of knowledge is hot, and only the sharpest blades will prevail.
                    </CardDescription>
                </CardHeader>
            </Card>
            
            {isLoading && (
                <div className="flex flex-col items-center justify-center text-center gap-4 mt-12">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="font-headline text-lg">Gathering available quests...</p>
                </div>
            )}

            {!isLoading && modules.length === 0 && (
                <div className="text-center text-muted-foreground mt-12 max-w-md mx-auto p-6 bg-muted/50 rounded-lg">
                    <p className='font-headline text-lg text-card-foreground'>The Training Grounds are Quiet</p>
                    <p className="mt-2">A Royal Wizard must first forge new Knowledge Dragons in the King&apos;s Court and have them approved before knights can begin their training.</p>
                </div>
            )}

            {!isLoading && modules.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-fade-in-up">
                    {modules.map((module) => {
                        const subject = getSubjectInfo(module.topic);
                        const quiz = module.content.quizQuestions;
                        
                        return (
                            <Card key={module.id} className="hover:border-primary/50 transition-all flex flex-col group overflow-hidden">
                                <CardHeader className="p-0">
                                    <div className="aspect-video relative w-full overflow-hidden">
                                        <Image
                                            src={module.image_data_uri}
                                            alt={module.topic}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 flex-grow">
                                    <CardTitle className="text-lg font-medium mb-2">{module.topic}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{subject.name}</Badge>
                                        <Badge variant="secondary">{module.exam_level}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">{quiz.length} questions</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button className="w-full" asChild>
                                        <Link href={`/dashboard/training/${module.id}`}>Start Training</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}


export default function WeaponTrainingPage() {
    return <WeaponTrainingContent />;
}
