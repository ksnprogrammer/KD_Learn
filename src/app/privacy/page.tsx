
'use client';

import { LegalLayout } from "@/components/legal-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
    return (
        <LegalLayout>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-4xl">Privacy Policy</CardTitle>
                    <CardDescription>Last Updated: July 26, 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-muted-foreground prose max-w-none">
                    <h3>1. Our Vow of Secrecy</h3>
                    <p>Your privacy is sacred to us. This policy explains what information we collect from our Knights and how we use it to protect and run the Kingdom.</p>
                    
                    <h3>2. Information We Gather</h3>
                    <p>When you register for Knighthood, we collect your name and email address. As you progress through quests, we also collect data on your performance and activity to help you track your progress and to improve the learning experience for all Knights.</p>

                    <h3>3. How We Use Your Information</h3>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Manage your account and your progress through the Kingdom.</li>
                        <li>Personalize your learning experience.</li>
                        <li>Communicate with you about important updates, new quests, and Kingdom news.</li>
                        <li>Maintain the security and integrity of our platform.</li>
                    </ul>

                    <h3>4. Sharing Your Information</h3>
                    <p>We do not sell or rent your personal information to third parties. Your information is a sacred trust. We may only share data with trusted Wizards (service providers) who help us operate the Kingdom, and only under strict confidentiality agreements.</p>

                    <h3>5. Securing the Realm</h3>
                    <p>We employ strong magical barriers (security measures) to protect your information from unauthorized access. However, no system is impenetrable, but we are committed to safeguarding the Kingdom's data.</p>
                </CardContent>
            </Card>
        </LegalLayout>
    );
}
