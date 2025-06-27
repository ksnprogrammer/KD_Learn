
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Upload, Loader2 } from "lucide-react";
import { submitPaymentForReview, getSignedUrl } from '@/app/actions';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';


interface Tier {
  name: string;
  price: string;
  numericPrice: number;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  variant: "primary" | "secondary";
}

const tiers: Tier[] = [
  {
    name: "Squire",
    price: "LKR 499",
    numericPrice: 499,
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
    numericPrice: 999,
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
    price: "LKR 1,999",
    numericPrice: 1999,
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
  const [selectedTier, setSelectedTier] = useState<Tier | null>(tiers[1]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const user = useUser();
  const userName = user?.user_metadata?.name || 'A New Recruit';
  
  const handleChooseTier = (tier: Tier) => {
    setSelectedTier(tier);
    toast({
      title: "Tier Selected",
      description: `You have selected the ${tier.name} tier. Please proceed with payment below.`,
    });
    // scroll to payment section
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    } else {
      setReceiptFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTier) {
        toast({
            variant: "destructive",
            title: "No Tier Selected",
            description: "Please choose a membership tier before submitting.",
        });
        return;
    }

    if (!receiptFile) {
      toast({
          variant: "destructive",
          title: "Receipt Required",
          description: "Please upload a proof of payment to continue.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const signedUrlResult = await getSignedUrl(receiptFile.name, receiptFile.type);
      if (!signedUrlResult.success || !signedUrlResult.data) {
          throw new Error(signedUrlResult.error || 'Failed to get upload URL.');
      }

      const { signedUrl, publicUrl } = signedUrlResult.data;

      const uploadResponse = await fetch(signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': receiptFile.type },
          body: receiptFile,
      });

      if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Upload failed: ${errorText}`);
      }
      
      const amount = selectedTier.numericPrice;
      const paymentType = `Membership (${selectedTier.name})`;

      const { success, error } = await submitPaymentForReview(userName, paymentType, amount, publicUrl);
    
      if (success) {
          toast({
              title: "Membership Request Submitted!",
              description: "Thank you! Your request is being reviewed and will be approved within 24 hours.",
          });
          setReceiptFile(null);
          const fileInput = document.getElementById('receipt-membership') as HTMLInputElement;
          if (fileInput) fileInput.value = '';

      } else {
          toast({
              variant: "destructive",
              title: "Submission Failed",
              description: error || "Could not submit your request. Please try again.",
          });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({
          variant: "destructive",
          title: "Submission Error",
          description: errorMessage,
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold">Forge Your Legacy</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Upgrade your knighthood to unlock powerful tools, exclusive quests, and support the growth of the kingdom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => (
          <Card key={tier.name} className={cn(
            'flex flex-col',
            tier.variant === 'primary' && 'border-primary border-2 shadow-primary/20 shadow-lg',
            selectedTier?.name === tier.name && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
            )}>
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
              <Button className="w-full" variant={tier.variant === 'primary' ? 'default' : 'outline'} onClick={() => handleChooseTier(tier)}>{tier.buttonText}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       <Card id="payment-section" className="w-full max-w-4xl mx-auto mt-12 scroll-mt-20">
        <CardHeader>
            <CardTitle>How to Activate Your Membership</CardTitle>
            <CardDescription>
              {selectedTier ? `You have selected the ${selectedTier.name} tier.` : "Please select a tier above."} Follow these steps to pay and begin your advanced training.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Step 1: Bank Transfer or Cash Deposit</h3>
                <p className="text-sm text-muted-foreground">
                    Please deposit the fee for your chosen tier to the following bank account. Use your name or email as the reference.
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
                    <Input id="receipt-membership" type="file" onChange={handleFileChange} accept="image/*,application/pdf" />
                </div>
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-lg py-6" onClick={handleSubmit} disabled={isSubmitting || !selectedTier}>
             {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Upload className="mr-2" />}
             {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
