
"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PackageCard } from "@/components/package-card";
import { ContactForm } from "@/components/contact-form";
import { MapSection } from "@/components/map-section";
import { PersonalizedRecommendations } from "@/components/personalized-recommendations";
import { ArrowRight, Mail } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { TravelPackage, HeroSlide } from "@/lib/types";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const firestore = useFirestore();
  
  const packagesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "travelPackages"));
  }, [firestore]);
  const { data: travelPackages, isLoading: isLoadingPackages } = useCollection<TravelPackage>(packagesCollection);
  
  const heroSlidesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "heroSlides"));
  }, [firestore]);
  const { data: heroSlides, isLoading: isLoadingSlides } = useCollection<HeroSlide>(heroSlidesCollection);

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsContactOpen(true);
    }
  }

  return (
    <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
      <div className="flex flex-col min-h-screen">
        <Header onContactClick={handleContactClick} />
        <main className="flex-1">
          {/* Hero Carousel Section */}
          <section className="relative w-full h-[80vh] md:h-[90vh] flex items-center justify-center text-center text-white">
            {isLoadingSlides ? (
              <Skeleton className="w-full h-full" />
            ) : heroSlides && heroSlides.length > 0 ? (
              <Carousel
                className="w-full h-full"
                opts={{ loop: true }}
                plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
              >
                <CarouselContent>
                  {heroSlides.map((slide, index) => (
                    <CarouselItem key={slide.id} className="relative w-full h-[80vh] md:h-[90vh]">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="relative z-10 p-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight font-headline">
                          {slide.title}
                        </h1>
                        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                          {slide.description}
                        </p>
                        <Button size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                          <Link href="/packages">
                            Explore Packages <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
              </Carousel>
            ) : (
               <div className="relative z-10 p-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full text-foreground">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-headline">
                    Welcome to MRM Internationals
                  </h1>
                  <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                    Add slides in the admin panel to populate the hero carousel.
                  </p>
               </div>
            )}
          </section>

          {/* Packages Section */}
          <section id="packages" className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 font-headline">
                Featured Travel Packages
              </h2>
              {isLoadingPackages && <p>Loading packages...</p>}
              {travelPackages && (
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-6xl mx-auto"
                >
                  <CarouselContent>
                    {travelPackages.map((pkg) => (
                      <CarouselItem key={pkg.id} className="sm:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <PackageCard travelPackage={pkg} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              )}
            </div>
          </section>
          
          {/* Contact Section */}
          <section id="contact" className="py-12 md:py-20 bg-primary/20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                Ready for Your Next Adventure?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Have questions or need a custom package? Our travel experts are here to help. Get in touch with us today!
              </p>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setIsContactOpen(true)}>
                <Mail className="mr-2 h-5 w-5" /> Get in Touch
              </Button>
            </div>
          </section>
          
          {/* Personalized Recommendations Section */}
          <section id="recommendations" className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <PersonalizedRecommendations />
            </div>
          </section>

        </main>
        <Footer />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <ContactForm />
        </DialogContent>
      </div>
    </Dialog>
  );
}

    