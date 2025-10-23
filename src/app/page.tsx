
"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PackageCard } from "@/components/package-card";
import { ContactForm } from "@/components/contact-form";
import { MapSection } from "@/components/map-section";
import { PersonalizedRecommendations } from "@/components/personalized-recommendations";
import { travelPackages } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero");
  const packageLocations = travelPackages.map(pkg => ({ id: pkg.id, location: pkg.location }));

  return (
    <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
      <div className="flex flex-col min-h-screen">
        <Header onContactClick={() => setIsContactOpen(true)} />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 p-4 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-headline">
                Your Journey Begins Here
              </h1>
              <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                Discover breathtaking destinations and create unforgettable memories with VoyageVista.
              </p>
              <Button size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <a href="#packages">
                  Explore Packages <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </section>

          {/* Packages Section */}
          <section id="packages" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
                Featured Travel Packages
              </h2>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-6xl mx-auto"
              >
                <CarouselContent>
                  {travelPackages.map((pkg) => (
                    <CarouselItem key={pkg.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <PackageCard travelPackage={pkg} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          </section>

          {/* Map Section */}
          <section id="map" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
                Our Destinations
              </h2>
              <MapSection locations={packageLocations} />
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-16 md:py-24 bg-primary/20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                Ready for Your Next Adventure?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Have questions or need a custom package? Our travel experts are here to help. Get in touch with us today!
              </p>
              <DialogTrigger asChild>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Mail className="mr-2 h-5 w-5" /> Get in Touch
                  </Button>
              </DialogTrigger>
            </div>
          </section>
          
          {/* Personalized Recommendations Section */}
          <section id="recommendations" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <PersonalizedRecommendations />
            </div>
          </section>

        </main>
        <Footer />
        <DialogContent className="sm:max-w-[425px]">
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
