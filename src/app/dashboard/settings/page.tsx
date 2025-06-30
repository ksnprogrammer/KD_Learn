'use client';

import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, KeyRound, Palette, User, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateUserPublicProfile } from "@/app/actions";

const profileFormSchema = z.object({
  knightName: z.string().min(3, "Name must be at least 3 characters.").max(50, "Name cannot exceed 50 characters."),
  avatarUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
  avatarHint: z.string().max(100, "Hint cannot exceed 100 characters.").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function SettingsForm() {
    const user = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const userName = user?.user_metadata?.name || 'Knight';
    const userAvatarUrl = user?.user_metadata?.avatar_url || '';
    const userAvatarHint = user?.user_metadata?.avatar_hint || '';
    const examLevel = user?.user_metadata?.exam_level || 'A/L';
    const userTitle = `Dragon Knight - ${examLevel} Path`;

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            knightName: userName,
            avatarUrl: userAvatarUrl,
            avatarHint: userAvatarHint,
        },
        mode: 'onChange',
    });

    async function onSubmit(values: ProfileFormValues) {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('knightName', values.knightName);
        formData.append('avatarUrl', values.avatarUrl || '');
        formData.append('avatarHint', values.avatarHint || '');

        const { success, error } = await updateUserPublicProfile(formData);
        setIsSubmitting(false);

        if (success) {
            toast({
                title: "Profile Updated",
                description: "Your Knight Name has been successfully changed.",
            });
            // Reset form dirty state so the button becomes disabled again
            form.reset({ knightName: values.knightName, avatarUrl: values.avatarUrl, avatarHint: values.avatarHint });
        } else {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: error || "An unexpected error occurred.",
            });
        }
    }

    return (
         <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="profile"><User className="mr-2 hidden md:flex" />Profile</TabsTrigger>
                <TabsTrigger value="account"><KeyRound className="mr-2 hidden md:flex" />Account</TabsTrigger>
                <TabsTrigger value="notifications"><Bell className="mr-2 hidden md:flex" />Notifications</TabsTrigger>
                <TabsTrigger value="appearance"><Palette className="mr-2 hidden md:flex" />Appearance</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Public Profile</CardTitle>
                                <CardDescription>This is how others will see you in the kingdom.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="knightName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Knight Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your knightly name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="avatarUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Avatar URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/avatar.png" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="avatarHint"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Avatar Hint</FormLabel>
                                            <FormControl>
                                                <Input placeholder="A brief description of your avatar" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-2">
                                    <Label htmlFor="knight-title">Title</Label>
                                    <Input id="knight-title" defaultValue={userTitle} disabled />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isSubmitting || !form.formState.isDirty || !form.formState.isValid}>
                                    {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            </TabsContent>
            <TabsContent value="account" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your login and security settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user?.email} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label>Password</Label>
                            <Button variant="outline">Change Password</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="notifications" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Choose what you want to be notified about.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive updates about new quests and kingdom news.
                                </p>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified about daily challenges and team war results.
                                </p>
                            </div>
                            <Switch id="push-notifications" />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="appearance" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of your kingdom.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="sound-effects" className="text-base">Sound Effects</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable or disable in-app sound effects.
                                </p>
                            </div>
                            <Switch id="sound-effects" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    The kingdom is already dark, knight.
                                </p>
                            </div>
                            <Switch id="dark-mode" defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

function SettingsContent() {
    return (
        <div className="container mx-auto py-8">
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>
                <SettingsForm />
            </div>
        </div>
    )
}


export default function SettingsPage() {
    return <SettingsContent />;
}
