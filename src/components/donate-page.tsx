'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartHandshake } from "lucide-react";
import { useState } from "react";

const presetAmounts = [1000, 2500, 5000, 10000];

export function DonatePageContent() {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(2500);
    const [customAmount, setCustomAmount] = useState("2500");

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


  return (
    <div className="container mx-auto py-8 flex justify-center">
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
        <CardFooter>
          <Button className="w-full text-lg py-6">
            Donate Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
