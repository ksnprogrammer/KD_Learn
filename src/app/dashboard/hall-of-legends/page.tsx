'use client';

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getStories } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Library, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Assuming stories have this shape from Supabase
interface Story {
    id: number;
    created_at: string;
    title: string;
    story: string;
    image_data_uri: string;
}

export default function HallOfLegendsPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchStories() {
            setIsLoading(true);
            const { success, data, error } = await getStories();
            if (success && data) {
                setStories(data as Story[]);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Failed to fetch legends',
                    description: error || 'Could not load the stories from the Hall of Legends.',
                });
            }
            setIsLoading(false);
        }
        fetchStories();
    }, [toast]);


    return (
        <SidebarProvider>
            <div className="relative flex min-h-dvh bg-background">
                <AppSidebar />
                <div className="relative flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="container mx-auto py-8">
                            <Card className="w-full max-w-6xl mx-auto mb-8 bg-transparent border-0 shadow-none">
                                <CardHeader className="text-center">
                                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                                        <Library className="w-10 h-10" />
                                    </div>
                                    <CardTitle className="font-headline text-3xl">Hall of Legends</CardTitle>
                                    <CardDescription>
                                        A gallery of epic tales and woven legends from across the kingdom.
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {isLoading && (
                                <div className="flex flex-col items-center justify-center text-center gap-4 mt-12">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                    <p className="font-headline text-lg">Opening the ancient tomes...</p>
                                </div>
                            )}

                            {!isLoading && stories.length === 0 && (
                                <div className="text-center text-muted-foreground mt-12">
                                    <p>The Hall of Legends is quiet. Weave a new story to begin the collection!</p>
                                </div>
                            )}

                            {!isLoading && stories.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                                    {stories.map((story) => (
                                        <Card key={story.id} className="overflow-hidden group hover:border-primary/50 transition-all">
                                            <CardHeader className="p-0">
                                                <div className="aspect-video relative w-full overflow-hidden">
                                                    <Image
                                                        src={story.image_data_uri}
                                                        alt={story.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <CardTitle className="font-headline text-xl mb-2">{story.title}</CardTitle>
                                                <CardDescription className="line-clamp-3 text-muted-foreground">{story.story}</CardDescription>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
