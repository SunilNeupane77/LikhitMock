
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ADDITIONAL_RESOURCES, DEFAULT_OG_IMAGE_URL, KEY_FEATURES, SITE_NAME, SITE_URL, TESTIMONIALS_DATA } from '@/lib/constants';
import { ArrowRight, ClipboardCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `${SITE_NAME}: Car & Bike Driving License Practice Tests (Nepal)`,
  description: `Prepare for Nepal's car (Category B) and bike/scooter (Category A) driving license (Likhit) tests with ${SITE_NAME}. Free online practice questions, real exam simulations, traffic signs, and more.`,
  keywords: ['Nepal driving license', 'Likhit exam', 'driving test practice Nepal', 'traffic signs Nepal', 'vehicle license Nepal', 'Category A test', 'Category B test', 'bike license Nepal', 'scooter license Nepal', 'car license Nepal', 'लिखित परीक्षा', 'नेपाल सवारी चालक अनुमतिपत्र'],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME}: Car & Bike Driving License Practice Tests (Nepal)`,
    description: `Prepare for Nepal's car (Category B) and bike/scooter (Category A) driving license (Likhit) tests with ${SITE_NAME}. Free online practice questions, real exam simulations, traffic signs, and more.`,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL, 
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Homepage`,
      },
    ],
    locale: 'en_US', 
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME}: Car & Bike Driving License Practice Tests (Nepal)`,
    description: `Prepare for Nepal's car (Category B) and bike/scooter (Category A) driving license (Likhit) tests with ${SITE_NAME}. Free online practice questions, real exam simulations, traffic signs, and more.`,
    images: [DEFAULT_OG_IMAGE_URL], 
  },
};


export default function HomePage() {
  

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[url('/images/traffic-pattern.png')] opacity-5 overflow-hidden">
        </div>
        <div className="container relative text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Pass Your Nepal Driving</span>
            <span className="block text-primary">License Exam</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Master the Likhit exam with our comprehensive mock tests, traffic sign tutorials, and real exam simulations.
          </p>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              <Link href="/real-exam"> 
                <ClipboardCheck className="mr-2 h-5 w-5" /> 
                Start Mock Exam 
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose <span className="text-primary">{SITE_NAME}</span>?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to pass your Likhit exam with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {KEY_FEATURES.map((feature) => (
              <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-2 border-t-primary">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold pt-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Hear From Our <span className="text-primary">Successful Users</span></h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Thousands have passed their exam using {SITE_NAME}.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS_DATA.map((testimonial) => (
              <Card key={testimonial.name} className="flex flex-col justify-between shadow-lg border-l-2 border-l-primary hover:shadow-2xl transition-all duration-300">
                <CardContent className="pt-6">
                  <blockquote className="text-lg text-foreground italic">"{testimonial.quote}"</blockquote>
                </CardContent>
                <CardHeader className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                      <AvatarImage src={testimonial.avatarImage} alt={testimonial.name} data-ai-hint="person face" />
                      <AvatarFallback className="bg-primary/10 text-primary">{testimonial.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-md font-semibold">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.location}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      


      {/* Additional Resources Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore More Resources</h2>
            <p className="mt-4 text-lg text-gray-300">
              Helpful guides and information to support your preparation.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {ADDITIONAL_RESOURCES.map((resource) => (
              <Card key={resource.title} className="group overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black/80 border border-gray-800 text-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                     <div className="bg-primary p-2 rounded-full">
                        <resource.icon className="h-5 w-5 text-white" />
                      </div>
                    <CardTitle className="text-xl font-semibold text-white">{resource.title}</CardTitle>
                  </div>
                   <CardDescription className="text-gray-400">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="px-0 text-primary hover:text-primary/80 group-hover:text-primary/90">
                    <Link href={resource.href}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Support Callout */}
       <section className="py-16 md:py-24 bg-black text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Need Help?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-gray-300">
            Have questions or need assistance with your preparation? Our team is here to support you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link href="/faq">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Download App Section Removed */}
    </>
  );
}
