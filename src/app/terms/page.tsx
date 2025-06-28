
'use client';

import { LegalLayout } from "@/components/legal-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
    return (
        <LegalLayout>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-4xl">Terms of Service</CardTitle>
                    <CardDescription>Last Updated: July 26, 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-muted-foreground prose max-w-none">
                    <h3>1. Welcome to the Kingdom</h3>
                    <p>These are the rules of the land. By creating an account and becoming a Knight, you agree to abide by these terms. This is a pact between you (the &quot;Knight&quot;) and us (the &quot;Kingdom&quot;). Our quest is to provide an epic learning experience, and we need your help to keep the community honorable and focused.</p>
                    
                    <h3>2. Your Knighthood (Account)</h3>
                    <p>You are responsible for your account and the secret word (password) that protects it. Do not share your credentials with others. Any activity under your account is your responsibility. You must provide accurate information when you register to become a Knight.</p>

                    <h3>3. Code of Conduct</h3>
                    <p>All Knights must behave with honor. Harassment, cheating, or any misuse of the platform will not be tolerated. Such actions may result in the suspension or termination of your knighthood without notice. The Kingdom&apos;s forums and discussion areas must be used for constructive and respectful conversation related to learning quests.</p>

                    <h3>4. The Kingdom&#39;s Treasures (Content)</h3>
                    <p>All content on this platform, including quests, lessons (&quot;dragons&quot;), and images, is the property of the Kingdom. You may not copy, sell, or redistribute our content without express permission. Your use of the platform is for personal, non-commercial learning purposes only.</p>

                    <h3>5. Changes to the Pact</h3>
                    <p>The Kingdom may update these terms from time to time. We will notify you of any significant changes. Continuing to use the platform after changes means you accept the new terms.</p>
                </CardContent>
            </Card>
        </LegalLayout>
    );
}
