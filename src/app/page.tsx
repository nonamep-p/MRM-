
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
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero");
  const packageLocations = travelPackages.map(pkg => ({ id: pkg.id, location: pkg.location }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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
        
        {/* Personalized Recommendations Section */}
        <section id="recommendations" className="py-16 md:py-24 bg-primary/20">
          <div className="container mx-auto px-4">
            <PersonalizedRecommendations />
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
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-headline">
                    Get in Touch
                </h2>
                <p className="text-center text-muted-foreground mb-8">
                    Have questions or ready to book your next adventure? Send us a message!
                </p>
                <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
