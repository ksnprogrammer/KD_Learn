'use client';

import { useState } from 'react';
import { AdminPanel } from "@/components/admin-panel";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// The secret word provided by the King
const SECRET_WORD = "I love my Queen.";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    if (inputValue === SECRET_WORD) {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the King's Court.",
      });
    } else {
      toast({
        variant: 'destructive',
        title: "Access Denied",
        description: "The secret word is incorrect. Entry is forbidden.",
      });
      setInputValue('');
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  if (isAuthenticated) {
    return <AdminPanel />;
  }

  return (
    <div className="flex items-center justify-center min-h-full py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
              <ShieldCheck className="w-10 h-10" />
          </div>
          <CardTitle className="font-headline text-3xl">King's Court</CardTitle>
          <CardDescription>
            This area is restricted to the King and his council. State the secret word to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              id="secret"
              type="password"
              placeholder="State the secret word..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            <KeyRound className="mr-2" />
            Enter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
