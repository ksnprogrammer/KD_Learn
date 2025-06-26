'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Upload } from "lucide-react";

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
  const { toast } = useToast();
  
  const handleChooseTier = (tierName: string) => {
    toast({
      title: "Tier Selected",
      description: `You have selected the ${tierName} tier. Please proceed with payment below to complete your upgrade.`,
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Membership Request Submitted!",
      description: "Thank you! Your request is being reviewed and will be approved within 24 hours.",
    });
  }

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
              <Button className="w-full" variant={tier.variant === 'primary' ? 'default' : 'outline'} onClick={() => handleChooseTier(tier.name)}>{tier.buttonText}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       <Card className="w-full max-w-4xl mx-auto mt-12">
        <CardHeader>
            <CardTitle>How to Activate Your Membership</CardTitle>
            <CardDescription>Follow these steps to pay for your chosen tier and begin your advanced training.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Step 1: Bank Transfer or Cash Deposit</h3>
                <p className="text-sm text-muted-foreground">
                    Please deposit your chosen membership fee to the following bank account. Use your name or email as the reference.
                </p>
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                    <p><strong>Bank:</strong> People's Bank</p>
                    <p><strong>Account Name:</strong> The King's Treasury</p>
                    <p><strong>Account Number:</strong> 123-456-7890</p>
                    <p><strong>Branch:</strong> Royal Capital Branch</p>
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-2">Step 2: Upload Proof of Payment</h3>
                <p className="text-sm text-muted-foreground mb-2">
                    Upload a screenshot or photo of your payment receipt. Approval may take up to 24 hours.
                </p>
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="receipt-membership">Payment Receipt</Label>
                    <Input id="receipt-membership" type="file" />
                </div>
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-lg py-6" onClick={handleSubmit}>
            <Upload className="mr-2" />
            Submit for Approval
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
