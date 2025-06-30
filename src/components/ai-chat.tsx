'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

declare global {
  interface Window {
    puter: any;
  }
}

export function AIChat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('Ask me anything!');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      if (window.puter && window.puter.ai && window.puter.ai.chat) {
        const aiResponse = await window.puter.ai.chat(message);
        setResponse(aiResponse);
      } else {
        setResponse('Puter.js AI chat not available. Make sure the script is loaded.');
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setResponse('Error: Could not get a response from AI.');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>AI Chat Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md h-24 overflow-y-auto">
          <p className="text-sm text-gray-700 dark:text-gray-300">{response}</p>
        </div>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            disabled={loading}
          />
          <Button onClick={handleSendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
