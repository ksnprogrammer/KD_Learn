
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function SettingsContent() {
    return (
        <div className="container mx-auto py-8">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                        <SettingsIcon className="w-10 h-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl text-center">Settings</CardTitle>
                    <CardDescription className="text-center">
                        Manage your account settings and preferences.
                    </CardDescription>
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
        </div>
    )
}


export default function SettingsPage() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-dvh bg-background">
                <AppSidebar />
                <div className="relative flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <SettingsContent />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
