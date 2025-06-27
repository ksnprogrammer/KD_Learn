import { getSubmissionById } from '@/app/actions';
import { TrainingSession } from '@/components/training-session';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

async function getModule(id: number) {
    const { success, data, error } = await getSubmissionById(id);

    if (!success || !data) {
        // We use a custom component instead of notFound() to provide a better UX
        return { data: null, error: error || 'An error occurred.' };
    }
    return { data, error: null };
}

type PageProps = {
  params: { id: string };
};

export default async function TrainingPage({ params }: PageProps) {
  const submissionId = parseInt(params.id, 10);
  if (isNaN(submissionId)) {
    notFound();
  }

  const { data: module, error } = await getModule(submissionId);

  return (
      <div className="container mx-auto py-8">
        {module ? (
            <div className="space-y-8">
                <Card className="w-full max-w-4xl mx-auto mb-8 bg-transparent border-0 shadow-none">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                            <BookOpen className="w-10 h-10" />
                        </div>
                        <CardTitle className="font-headline text-3xl">{module.topic}</CardTitle>
                        <CardDescription className='flex items-center justify-center gap-2'>
                            A training module forged to test your knowledge.
                            <Badge variant="secondary">{module.exam_level}</Badge>
                        </CardDescription>
                    </CardHeader>
                </Card>

                 {module.image_data_uri && (
                    <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden border">
                        <Image
                            src={module.image_data_uri}
                            alt={module.topic}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <TrainingSession module={module.content} submissionId={submissionId} />
            </div>
        ) : (
            <Card className="w-full max-w-lg mx-auto text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Quest Unavailable</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                      <Link href="/dashboard/weapon-training">Return to Training Grounds</Link>
                    </Button>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
