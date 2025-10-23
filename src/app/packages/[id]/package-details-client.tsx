
'use client';

import { useState } from 'react';
import Image from 'next/image';

import type { TravelPackage, SiteSettings } from '@/lib/types';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ContactForm } from '@/components/contact-form';

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
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CalendarDays, Check, MapPin, Plane, Tag, X } from 'lucide-react';

export function PackageDetailsClient({ travelPackage, siteSettings }: { travelPackage: TravelPackage, siteSettings: SiteSettings | null }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const { title, description, duration, price, location, category, inclusions, exclusions, itinerary, image } = travelPackage;

  return (
    <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
      <div className="flex flex-col min-h-screen bg-background">
        <Header onContactClick={() => setIsContactOpen(true)} />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative w-full h-[60vh] flex items-center justify-center text-center text-white">
            {image && (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 p-4 max-w-4xl mx-auto">
                <Badge variant="outline" className="mb-4 border-accent text-accent bg-background/20 backdrop-blur-sm">
                  {category}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-headline">
                  {title}
                </h1>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5"/>
                        <span>{location ? `Location: ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : 'Location not available'}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-2xl font-bold bg-background/20 text-white backdrop-blur-sm py-1 px-3 rounded-lg">
                         <Tag className="h-6 w-6" />
                        <span>
                            {siteSettings?.defaultCurrency} {price.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-16 md:py-24 animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Left Column */}
              <div className="lg:col-span-2">
                 <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4">About this trip</h2>
                    <p className="text-lg text-muted-foreground">{description}</p>
                 </div>

                {itinerary && itinerary.length > 0 && (
                  <div>
                      <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6">Daily Itinerary</h2>
                      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                          {itinerary.map((item, index) => (
                          <AccordionItem value={`item-${index}`} key={index}>
                              <AccordionTrigger className="text-lg">
                                  <div className="flex items-center gap-4">
                                      <span className="font-semibold">{`Day ${item.day}: ${item.title}`}</span>
                                  </div>
                              </AccordionTrigger>
                              <AccordionContent className="pl-4">
                                 {item.description}
                              </AccordionContent>
                          </AccordionItem>
                          ))}
                      </Accordion>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="lg:sticky top-24 h-fit">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Pricing & Booking</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center my-4">
                            <p className="text-sm text-muted-foreground">Starting from</p>
                            <p className="text-4xl font-bold text-foreground">
                                {siteSettings?.defaultCurrency} {price.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">per person</p>
                        </div>
                        {inclusions && inclusions.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                    <Check className="h-5 w-5 text-green-500" />
                                    What's Included
                                </h3>
                                <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                                    {inclusions.map((item, index) => (
                                        <li key={index}>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                         {exclusions && exclusions.length > 0 && (
                             <div>
                                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                    <X className="h-5 w-5 text-red-500" />
                                    What's Not Included
                                </h3>
                                <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                                    {exclusions.map((item, index) => (
                                        <li key={index}>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                         )}
                         <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-4" onClick={() => setIsContactOpen(true)}>
                            <Plane className="mr-2 h-5 w-5" /> Book This Trip
                        </Button>
                    </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquire About This Trip</DialogTitle>
            <DialogDescription>
              Interested in the "{title}" package? Fill out the form and we'll get back to you!
            </DialogDescription>
          </DialogHeader>
          <ContactForm sourcePackage={title} />
        </DialogContent>
      </div>
    </Dialog>
  );
}
