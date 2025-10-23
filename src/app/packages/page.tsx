"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PackageCard } from "@/components/package-card";
import { travelPackages } from "@/lib/data";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ContactForm } from "@/components/contact-form";

export default function PackagesPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
      <div className="flex flex-col min-h-screen bg-background">
        <Header onContactClick={() => setIsContactOpen(true)} />
        <main className="flex-1 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
              Our Travel Packages
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {travelPackages.map((pkg) => (
                <PackageCard key={pkg.id} travelPackage={pkg} />
              ))}
            </div>
          </div>
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
