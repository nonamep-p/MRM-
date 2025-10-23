
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PackageCard } from "@/components/package-card";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ContactForm } from "@/components/contact-form";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { TravelPackage } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories: TravelPackage['category'][] = ['Luxury', 'Comfort', 'Adventure', 'Family', 'Honeymoon', 'Cultural', 'Budget', 'Romantic'];
const priceRanges = [
    { label: "Any Price", value: "any" },
    { label: "Under $2,000", value: "0-2000" },
    { label: "$2,000 - $4,000", value: "2000-4000" },
    { label: "$4,000 - $6,000", value: "4000-6000" },
    { label: "$6,000+", value: "6000-Infinity" },
];

export default function PackagesPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("any");

  const firestore = useFirestore();
  const packagesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "travelPackages"));
  }, [firestore]);
  const { data: travelPackages, isLoading } = useCollection<TravelPackage>(packagesCollection);

  const filteredPackages = useMemo(() => {
    if (!travelPackages) return [];
    
    let packages = travelPackages;

    // Category filter
    if (categoryFilter !== 'all') {
      packages = packages.filter(pkg => pkg.category === categoryFilter);
    }

    // Price filter
    if (priceFilter !== 'any') {
      const [min, max] = priceFilter.split('-').map(Number);
      packages = packages.filter(pkg => {
        if (max === Infinity) {
            return pkg.price >= min;
        }
        return pkg.price >= min && pkg.price < max;
      });
    }

    return packages;
  }, [travelPackages, categoryFilter, priceFilter]);

  const handleClearFilters = () => {
    setCategoryFilter("all");
    setPriceFilter("any");
  };

  const handleContactClick = () => {
    setIsContactOpen(true);
  }

  return (
    <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
      <div className="flex flex-col min-h-screen bg-background">
        <Header onContactClick={handleContactClick} />
        <main className="flex-1 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 font-headline">
              Our Travel Packages
            </h1>
            
            <Card className="p-4 mb-12 flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div>
                    <label htmlFor="category-filter" className="text-sm font-medium mb-1 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger id="category-filter">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                     <label htmlFor="price-filter" className="text-sm font-medium mb-1 block">Price Range</label>
                     <Select value={priceFilter} onValueChange={setPriceFilter}>
                        <SelectTrigger id="price-filter">
                            <SelectValue placeholder="Filter by price" />
                        </SelectTrigger>
                        <SelectContent>
                            {priceRanges.map(range => (
                                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <div className="pt-4 md:pt-0 md:pl-4">
                 <Button onClick={handleClearFilters} variant="outline" className="mt-4 md:mt-0 w-full md:w-auto">Clear Filters</Button>
              </div>
            </Card>

            {isLoading && <p className="text-center">Loading packages...</p>}
            
            {!isLoading && filteredPackages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} travelPackage={pkg} />
                ))}
              </div>
            )}

            {!isLoading && filteredPackages.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <h2 className="text-xl font-semibold">No Packages Found</h2>
                    <p className="mt-2">Try adjusting your filters or check back later for new travel packages.</p>
                </div>
            )}
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
