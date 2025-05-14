
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, MessageSquare, Clock, ArrowRight } from 'lucide-react'; // Added ArrowRight
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';


// Placeholder video tutorials data - in a real app, this would come from a CMS or database
const tutorialsData = [
   {
    id: "traffic-signs-explained",
    title: "Understanding Nepal's Traffic Signs (Part 1: Mandatory Signs)",
    description: "A comprehensive visual guide to mandatory traffic signs in Nepal, explaining their meaning and importance for road safety. This video covers all essential mandatory signs you'll encounter on Nepali roads and in your Likhit exam.",
    thumbnailUrl: "https://picsum.photos/seed/tutorial1/600/338",
    dataAiHint: "traffic signs video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example YouTube embed URL
    duration: "12:35",
    category: "Traffic Signs",
    uploadDate: "2024-07-25",
    views: 12503,
    likes: 875,
    comments: 42,
    relatedVideos: [
        { id: "likhit-exam-overview", title: "Nepal Likhit Exam: What to Expect", thumbnailUrl: "https://picsum.photos/seed/tutorial2/160/90", dataAiHint: "computer test" },
        { id: "trial-common-mistakes", title: "Common Mistakes in Nepal Driving Trial", thumbnailUrl: "https://picsum.photos/seed/tutorial3/160/90", dataAiHint: "driving error" },
    ]
  },
  {
    id: "likhit-exam-overview",
    title: "Nepal Likhit Exam: What to Expect",
    description: "An overview of the computer-based Likhit exam format, question types, and tips for navigating the test interface. Prepare yourself for what the actual test day will look like.",
    thumbnailUrl: "https://picsum.photos/seed/tutorial2/600/338",
    dataAiHint: "exam preparation video",
    videoUrl: "https://www.youtube.com/embed/rokGy0huYEA", // Another example
    duration: "08:52",
    category: "Exam Preparation",
    uploadDate: "2024-07-18",
    views: 8900,
    likes: 620,
    comments: 28,
     relatedVideos: [
        { id: "traffic-signs-explained", title: "Understanding Nepal's Traffic Signs", thumbnailUrl: "https://picsum.photos/seed/tutorial1/160/90", dataAiHint: "traffic information" },
        { id: "trial-common-mistakes", title: "Common Mistakes in Nepal Driving Trial", thumbnailUrl: "https://picsum.photos/seed/tutorial3/160/90", dataAiHint: "road safety" },
    ]
  },
   {
    id: "trial-common-mistakes",
    title: "Common Mistakes in Nepal Driving Trial (Bike & Scooter)",
    description: "Learn about common errors made during the practical driving test for two-wheelers and how to avoid them. This video demonstrates typical mistakes and provides guidance for a smoother trial experience.",
    thumbnailUrl: "https://picsum.photos/seed/tutorial3/600/338",
    dataAiHint: "motorcycle test mistakes",
    videoUrl: "https://www.youtube.com/embed/watch?v=h6fcK_fRYaI",
    duration: "15:20",
    category: "Driving Trial",
    uploadDate: "2024-07-10",
    views: 15230,
    likes: 1105,
    comments: 76,
    relatedVideos: [
        { id: "traffic-signs-explained", title: "Understanding Nepal's Traffic Signs", thumbnailUrl: "https://picsum.photos/seed/tutorial1/160/90", dataAiHint: "signage system" },
        { id: "likhit-exam-overview", title: "Nepal Likhit Exam: What to Expect", thumbnailUrl: "https://picsum.photos/seed/tutorial2/160/90", dataAiHint: "test preparation" },
    ]
  },
];

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const tutorial = tutorialsData.find(t => t.id === params.id);
  if (!tutorial) {
    return {
      title: `Tutorial Not Found | ${SITE_NAME}`,
      description: "The video tutorial you are looking for could not be found.",
    };
  }
  return {
    title: `${tutorial.title} | ${SITE_NAME}`,
    description: tutorial.description,
     openGraph: {
      title: tutorial.title,
      description: tutorial.description,
      type: 'video.other', // or video.episode, video.movie, video.tv_show
      videos: [{ url: tutorial.videoUrl }],
      images: [{ url: tutorial.thumbnailUrl }],
    },
  };
}

export async function generateStaticParams() {
  return tutorialsData.map((tutorial) => ({
    id: tutorial.id,
  }));
}

export default function TutorialPage({ params }: { params: { id: string } }) {
  const tutorial = tutorialsData.find(t => t.id === params.id);

  if (!tutorial) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Tutorial Not Found</h1>
        <p className="text-muted-foreground mb-6">This video tutorial doesn't exist or may have been moved.</p>
        <Button asChild>
          <Link href="/tutorials">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tutorials
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
       <Button asChild variant="ghost" className="mb-6 pl-0 text-primary hover:bg-transparent">
        <Link href="/tutorials">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tutorials
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-xl">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <iframe
                src={tutorial.videoUrl}
                title={tutorial.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </AspectRatio>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">{tutorial.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                <span>{tutorial.category}</span>
                <span className="hidden sm:inline">•</span>
                <span>{new Date(tutorial.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                 <span className="hidden sm:inline">•</span>
                <span>Duration: {tutorial.duration}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <span>{tutorial.views.toLocaleString()} views</span>
                <div className="flex items-center"><ThumbsUp className="h-4 w-4 mr-1" /> {tutorial.likes.toLocaleString()}</div>
                <div className="flex items-center"><MessageSquare className="h-4 w-4 mr-1" /> {tutorial.comments.toLocaleString()}</div>
              </div>
              <p className="text-base text-foreground/90 leading-relaxed">{tutorial.description}</p>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Related Videos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tutorial.relatedVideos && tutorial.relatedVideos.length > 0 ? tutorial.relatedVideos.map(related => (
                <Link key={related.id} href={`/tutorials/${related.id}`} className="block group">
                  <div className="flex items-start gap-3">
                    <div className="relative w-28 h-16 rounded overflow-hidden shrink-0">
                       <Image src={related.thumbnailUrl} alt={related.title} fill className="object-cover" data-ai-hint={related.dataAiHint || "video thumbnail"} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold group-hover:text-primary transition-colors leading-tight">{related.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{SITE_NAME}</p>
                    </div>
                  </div>
                </Link>
              )) : <p className="text-sm text-muted-foreground">No related videos found.</p>}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/practice"><Clock className="mr-2 h-4 w-4" /> Take a Practice Test</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/traffic-signs"><ArrowRight className="mr-2 h-4 w-4" /> Study Traffic Signs</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
