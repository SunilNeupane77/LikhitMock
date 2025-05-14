
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: `Video Tutorials | ${SITE_NAME}`,
  description: `Watch video tutorials on ${SITE_NAME} to understand Nepal's traffic signs, driving rules, and exam procedures.`,
};

// Placeholder video tutorials data
const tutorials = [
  {
    id: "traffic-signs-explained",
    title: "Traffic Signs in Nepal | Nepali Driving License Exam",
    description: "This video provides a comprehensive overview of mandatory traffic signs in Nepal, essential for anyone preparing for the driving license exam.",
    thumbnailUrl: "https://i.ytimg.com/vi/uQHYrEPLImw/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/uQHYrEPLImw",
    duration: "9:15",
    category: "Traffic Signs",
    dataAiHint: "traffic sign video",
  },
  {
    id: "likhit-exam-overview",
    title: "Driving License Likhit Exam Questions In Nepal",
    description: "An insightful video detailing the format, question types, and preparation tips for Nepal's computer-based Likhit exam.",
    thumbnailUrl: "https://i.ytimg.com/vi/mPEV_u6_ebM/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/mPEV_u6_ebM",
    duration: "10:05",
    category: "Exam Preparation",
    dataAiHint: "computer test tutorial",
  },
  {
    id: "trial-common-mistakes",
    title: "How to Pass Bike Trial In Nepal",
    description: "This video highlights frequent errors made during the practical driving test for two-wheelers and offers strategies to avoid them.",
    thumbnailUrl: "https://i.ytimg.com/vi/-puDFnQgz5w/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/-puDFnQgz5w",
    duration: "7:30",
    category: "Driving Trial",
    dataAiHint: "motorcycle driving test",
  },
];


export default function TutorialsPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Video Tutorials
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Learn visually with our collection of helpful video guides for your driving license preparation.
        </p>
      </header>

      {tutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/tutorials/${tutorial.id}`} className="block group">
                <div className="relative aspect-video w-full">
                  <Image 
                    src={tutorial.thumbnailUrl} 
                    alt={tutorial.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={tutorial.dataAiHint}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>
                </div>
              </Link>
              <CardHeader>
                 <p className="text-sm text-primary font-medium mb-1">{tutorial.category}</p>
                <Link href={`/tutorials/${tutorial.id}`}>
                  <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">{tutorial.title}</CardTitle>
                </Link>
                <p className="text-xs text-muted-foreground">Duration: {tutorial.duration}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{tutorial.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="px-0 text-primary">
                  <Link href={`/tutorials/${tutorial.id}`}>
                    Watch Video <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <PlayCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">No Tutorials Available Yet</h2>
          <p className="text-muted-foreground mt-2">We're working on creating helpful video content. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
