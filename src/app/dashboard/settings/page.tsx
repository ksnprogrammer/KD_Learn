'use client';

import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, KeyRound, Palette, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SettingsForm() {
    const user = useUser();
    const userName = user?.user_metadata?.name || 'Knight';
    const examLevel = user?.user_metadata?.exam_level || 'A/L';
    const userTitle = `Dragon Knight - ${examLevel} Path`;

    return (
         <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="profile"><User className="mr-2 hidden md:flex" />Profile</TabsTrigger>
                <TabsTrigger value="account"><KeyRound className="mr-2 hidden md:flex" />Account</TabsTrigger>
                <TabsTrigger value="notifications"><Bell className="mr-2 hidden md:flex" />Notifications</TabsTrigger>
                <TabsTrigger value="appearance"><Palette className="mr-2 hidden md:flex" />Appearance</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Public Profile</CardTitle>
                        <CardDescription>This is how others will see you in the kingdom.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="knight-name">Knight Name</Label>
                            <Input id="knight-name" defaultValue={userName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="knight-title">Title</Label>
                            <Input id="knight-title" defaultValue={userTitle} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>
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
                            <Switch id="dark-mode" defaultChecked disabled />
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
