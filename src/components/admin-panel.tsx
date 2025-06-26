'use client';

import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AdminPanel() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Upload and manage images for the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="picture">Upload Image</Label>
            <div className="flex gap-2">
              <Input id="picture" type="file" className="flex-1" />
              <Button>
                <Upload className="mr-2" />
                Upload
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              You can upload PNG, JPG, or GIF files. Max size 5MB.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
