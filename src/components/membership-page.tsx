'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Squire",
    price: "LKR 499",
    period: "/month",
    description: "For the aspiring knight beginning their journey.",
    features: [
      "Access to all standard quests",
      "Community discussion access",
      "Daily challenges",
    ],
    buttonText: "Choose Squire",
    variant: "secondary"
  },
  {
    name: "Dragon Knight",
    price: "LKR 999",
    period: "/month",
    description: "For the dedicated knight seeking mastery.",
    features: [
      "Everything in Squire",
      "Unlock advanced & weekly challenges",
      "Ad-free experience",
      "Exclusive 'Dragon Knight' badge",
      "Priority support from the Wizards",
    ],
    buttonText: "Become a Dragon Knight",
    variant: "primary"
  },
  {
    name: "Grand Master",
    price: "LKR 1999",
    period: "/month",
    description: "For the ultimate legend of the kingdom.",
    features: [
      "Everything in Dragon Knight",
      "Access to exclusive live sessions",
      "Direct line to the King's Council",
      "Vote on new platform features",
    ],
    buttonText: "Ascend to Grand Master",
    variant: "secondary"
  },
];

export function MembershipPageContent() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold">Forge Your Legacy</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Upgrade your knighthood to unlock powerful tools, exclusive quests, and support the growth of the kingdom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.variant === 'primary' ? 'border-primary border-2 shadow-primary/20 shadow-lg' : ''}`}>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="flex items-baseline pt-4">
                 <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                 <span className="text-sm font-semibold ml-1 text-muted-foreground">{tier.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 mt-1 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.variant === 'primary' ? 'default' : 'outline'}>{tier.buttonText}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
