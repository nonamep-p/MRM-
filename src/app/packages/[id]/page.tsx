'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { travelPackages } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ContactForm } from '@/components/contact-form';
import { Clock, Tag, MapPin, Plane, Check, X, ArrowLeft, CalendarDays, Award } from 'lucide-react';
import Link from 'next/link';

export default function PackageDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const travelPackage = travelPackages.find((p) => p.id === params.id);

  if (!travelPackage) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === travelPackage.image);
  const { title, description, duration, price, location, grade, inclusions, exclusions, itinerary } = travelPackage;

  return (
    <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
      <div className="flex flex-col min-h-screen bg-background">
        <Header onContactClick={() => setIsContactOpen(true)} />
        <main className="flex-1 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Link href="/packages" className="inline-flex items-center text-sm font-medium text-accent hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Packages
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg border mb-4">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                </div>
                 <div className="flex justify-between items-center text-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-accent" />
                        <span className="font-bold text-2xl text-foreground">
                            ${price.toLocaleString()}
                        </span>
                    </div>
                </div>
              </div>

              <div>
                <Badge variant="outline" className="mb-2 border-accent text-accent flex items-center gap-2 w-min whitespace-nowrap">
                  <Award className="h-4 w-4" /> {grade}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                    <MapPin className="h-4 w-4" />
                    <span>{Object.keys(location).length > 0 ? `Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Location not available'}</span>
                </div>

                <p className="text-muted-foreground text-lg mb-6">{description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {inclusions && inclusions.length > 0 && (
                      <div>
                          <h3 className="font-semibold text-xl mb-3 font-headline">What's Included</h3>
                          <ul className="space-y-2 text-muted-foreground">
                              {inclusions.map((item, index) => (
                                  <li key={index} className="flex items-center gap-3">
                                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                      <span>{item}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}
                  {exclusions && exclusions.length > 0 && (
                       <div>
                          <h3 className="font-semibold text-xl mb-3 font-headline">What's Not Included</h3>
                          <ul className="space-y-2 text-muted-foreground">
                              {exclusions.map((item, index) => (
                                  <li key={index} className="flex items-center gap-3">
                                      <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                                      <span>{item}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}
                </div>
                
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setIsContactOpen(true)}>
                    <Plane className="mr-2 h-5 w-5" /> Book This Trip
                </Button>
              </div>
            </div>
            
            {itinerary && itinerary.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6 text-center">Daily Itinerary</h2>
                    <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto" defaultValue="item-0">
                        {itinerary.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4">
                                    <div className="bg-accent text-accent-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">{item.day}</div>
                                    <span className="font-semibold">{item.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pl-12">
                               {item.description}
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}

          </div>
        </main>
        <Footer />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              Interested in the "{title}" package? Fill out the form and we'll get back to you!
            </DialogDescription>
          </DialogHeader>
          <ContactForm />
        </DialogContent>
      </div>
    </Dialog>
  );
}
