
'use client';

import { Compass, Mail, Phone, MapPin, Twitter, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SiteSettings } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

export function Footer() {
  const firestore = useFirestore();
  const settingsDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "siteSettings", "main");
  }, [firestore]);

  const { data: siteSettings, isLoading } = useDoc<SiteSettings>(settingsDocRef);

  return (
    <footer className="bg-primary/50 text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Compass className="h-8 w-8 text-accent" />
              <span className="font-bold text-2xl font-headline">
                VoyageVista
              </span>
            </Link>
            <p className="text-foreground/80 max-w-sm">
              Crafting unforgettable travel experiences tailored just for you.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline">Contact Us</h3>
            {isLoading ? (
                <ul className="space-y-3">
                    <li><Skeleton className="h-5 w-48" /></li>
                    <li><Skeleton className="h-5 w-32" /></li>
                    <li><Skeleton className="h-5 w-40" /></li>
                </ul>
            ) : siteSettings ? (
                <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span>{siteSettings.address}</span>
                </li>
                <li className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-accent" />
                    <a href={`tel:${siteSettings.phone}`} className="hover:text-accent">{siteSettings.phone}</a>
                </li>
                <li className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-accent" />
                    <a href={`mailto:${siteSettings.email}`} className="hover:text-accent">{siteSettings.email}</a>
                </li>
                </ul>
            ) : (
                 <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-accent" />
                <span>123 Adventure Ave, Wanderlust City, 98765</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent" />
                <a href="tel:+1234567890" className="hover:text-accent">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <a href="mailto:hello@voyagevista.com" className="hover:text-accent">hello@voyagevista.com</a>
              </li>
            </ul>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline">Follow Us</h3>
             {isLoading ? (
                <div className="flex space-x-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                </div>
            ) : siteSettings ? (
                <div className="flex space-x-4">
                    {siteSettings.twitterUrl && (<Link href={siteSettings.twitterUrl} className="text-foreground/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-6 w-6" />
                        <span className="sr-only">Twitter</span>
                    </Link>)}
                     {siteSettings.instagramUrl && (<Link href={siteSettings.instagramUrl} className="text-foreground/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-6 w-6" />
                        <span className="sr-only">Instagram</span>
                    </Link>)}
                     {siteSettings.facebookUrl && (<Link href={siteSettings.facebookUrl} className="text-foreground/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-6 w-6" />
                        <span className="sr-only">Facebook</span>
                    </Link>)}
                </div>
            ) : (
                <div className="flex space-x-4">
                    <Link href="#" className="text-foreground/80 hover:text-accent">
                        <Twitter className="h-6 w-6" />
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link href="#" className="text-foreground/80 hover:text-accent">
                        <Instagram className="h-6 w-6" />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="#" className="text-foreground/80 hover:text-accent">
                        <Facebook className="h-6 w-6" />
                        <span className="sr-only">Facebook</span>
                    </Link>
                </div>
            )}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} VoyageVista. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
