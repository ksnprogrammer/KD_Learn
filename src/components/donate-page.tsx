
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartHandshake, Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { submitPaymentForReview, getSignedUrl } from "@/app/actions";
import { useUser } from "@/hooks/use-user";

const presetAmounts = [1000, 2500, 5000, 10000];

export function DonatePageContent() {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(2500);
    const [customAmount, setCustomAmount] = useState("2500");
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const user = useUser();
    const userName = user?.user_metadata?.name || 'A Loyal Subject';

    const handlePresetClick = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount(amount.toString());
    }
    
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomAmount(value);
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue) && presetAmounts.includes(numericValue)) {
            setSelectedAmount(numericValue);
        } else {
            setSelectedAmount(null);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReceiptFile(file);
        } else {
            setReceiptFile(null);
        }
    };

    const handleSubmit = async () => {
        const amount = parseInt(customAmount, 10);
        if (isNaN(amount) || amount <= 0) {
            toast({
                variant: "destructive",
                title: "Invalid Amount",
                description: "Please enter a valid donation amount.",
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

            const { success, error } = await submitPaymentForReview(userName, 'Donation', amount, publicUrl);
        
            if (success) {
                toast({
                    title: "Donation Submitted!",
                    description: "Thank you for supporting the kingdom! Your donation is being reviewed.",
                });
                setReceiptFile(null);
                const fileInput = document.getElementById('receipt') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                 toast({
                    variant: "destructive",
                    title: "Submission Failed",
                    description: error || "Could not submit your donation. Please try again.",
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
    <div className="container mx-auto py-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                <HeartHandshake className="w-10 h-10" />
            </div>
          <CardTitle className="font-headline text-3xl">Support the Kingdom</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Your generous contributions help us maintain the servers, develop new quests, and provide the best learning experience for all knights in Sri Lanka.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {presetAmounts.map(amount => (
                     <Button 
                        key={amount} 
                        variant={selectedAmount === amount ? "default" : "outline"}
                        onClick={() => handlePresetClick(amount)}
                        className="h-16 text-lg"
                    >
                        LKR {amount.toLocaleString()}
                    </Button>
                ))}
            </div>
            <div className="space-y-2">
                <Label htmlFor="custom-amount">Or Enter a Custom Amount (LKR)</Label>
                <Input 
                    id="custom-amount" 
                    type="number" 
                    placeholder="e.g. 1500" 
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                />
            </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl">
        <CardHeader>
            <CardTitle>Complete Your Donation</CardTitle>
            <CardDescription>Follow these steps to send your contribution to the kingdom's treasury.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Step 1: Bank Transfer</h3>
                <p className="text-sm text-muted-foreground">
                    Please deposit your chosen amount to the following bank account. Use your name or email as the reference.
                </p>
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                    <p><strong>Bank:</strong> People's Bank</p>
                    <p><strong>Account Name:</strong> The King's Treasury</p>
                    <p><strong>Account Number:</strong> 123-456-7890</p>
                    <p><strong>Branch:</strong> Royal Capital Branch</p>
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-2">Step 2: Upload Receipt</h3>
                <p className="text-sm text-muted-foreground mb-2">
                    Upload a screenshot or photo of your payment receipt for verification. This is required to confirm your donation.
                </p>
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="receipt">Payment Receipt</Label>
                    <Input id="receipt" type="file" onChange={handleFileChange} accept="image/*,application/pdf" />
                </div>
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-lg py-6" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Upload className="mr-2" />}
            {isSubmitting ? 'Submitting...' : 'Submit Donation for Approval'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
