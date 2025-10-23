
      
'use client';

import { Mail, Phone, MapPin, Twitter, Instagram, Facebook, Linkedin, Youtube, Pin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SiteSettings } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

function PinterestIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.5 12c0-2.5 1.5-4.5 4-4.5 2.5 0 4.5 2 4.5 4.5 0 2.5-1.5 4.5-4 4.5-1.25 0-2.4-.5-3.2-1.3-.5.3-.8.7-1.1 1.2-.3.6-.5 1.2-.5 1.8 0 .5.2 1 .5 1.3 1.5 1.7 1.5 4.7 0 6.4-1.5 1.7-4.5 1.7-6 0-1.5-1.7-1.5-4.7 0-6.4.3-.3.5-.8.5-1.3 0-.6-.2-1.2-.5-1.8-.3-.5-.6-1-1.1-1.2-.8.8-1.9 1.3-3.2 1.3-2.5 0-4-2-4-4.5S3.5 7.5 6 7.5c2.5 0 4 2 4 4.5 0 1-.2 1.9-.6 2.7.4.3.8.5 1.3.6.8-.7 1.2-1.6 1.2-2.6a4.3 4.3 0 0 0-1.2-3.1c-.6-.6-1.5-.8-2.3-.6-1.5.3-2.5 1.7-2.5 3.1 0 1.5 1.1 2.8 2.6 2.8.5 0 1-.2 1.4-.4.4.7.9 1.3 1.5 1.8-.6.5-1.3.8-2.1.8-1.7 0-3.1-1.4-3.1-3.1 0-1.7 1.4-3.1 3.1-3.1.5 0 1 .1 1.4.3.4-.6.8-1.2 1.1-1.8.3-.6.5-1.3.5-2 .5-1.5 0-3.1-1.4-3.8-1.8-.8-3.1-1-4.8.4-1.8 1.4-2.8 3.5-2.8 5.6 0 3.8 3.1 6.9 6.9 6.9s6.9-3.1 6.9-6.9c0-1.4-.4-2.7-1.1-3.8.3-.2.6-.4.8-.7.6.8 1 1.8 1 2.9 0 2.5-2 4.5-4.5 4.5-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c1.1 0 2.2.4 3 1.2.2.3.4.6.5.9.3.8.5 1.6.5 2.5z"></path>
        </svg>
    )
}

export function Footer() {
  const firestore = useFirestore();
  const settingsDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "siteSettings", "main");
  }, [firestore]);

  const { data: siteSettings, isLoading } = useDoc<SiteSettings>(settingsDocRef);
  
  const hasSocials = siteSettings && (
      siteSettings.twitterUrl ||
      siteSettings.instagramUrl ||
      siteSettings.facebookUrl ||
      siteSettings.linkedinUrl ||
      siteSettings.youtubeUrl ||
      siteSettings.pinterestUrl
  );


  return (
    <footer className="bg-primary/50 text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
          <Link href="/" className="flex items-center gap-2 mb-4">
              {siteSettings?.logoUrl && (
                <div className="relative h-20 w-52">
                  <Image src={siteSettings.logoUrl} alt="Logo" fill className="object-contain" />
                </div>
              )}
              {siteSettings?.logoText && (
                <span className={cn("font-bold", siteSettings.logoTextSize)} style={{ color: siteSettings.logoTextColor, fontFamily: siteSettings.logoFontFamily }}>{siteSettings.logoText}</span>
              )}
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
                <a href="mailto:hello@mrminternationals.com" className="hover:text-accent">hello@mrminternationals.com</a>
              </li>
            </ul>
            )}
          </div>
          <div>
            {isLoading ? (
                 <div className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <div className="flex space-x-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                </div>
            ) : hasSocials ? (
                <>
                    <h3 className="text-lg font-semibold mb-4 font-headline">Follow Us</h3>
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
                        {siteSettings.linkedinUrl && (<Link href={siteSettings.linkedinUrl} className="text-foreground/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-6 w-6" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>)}
                        {siteSettings.youtubeUrl && (<Link href={siteSettings.youtubeUrl} className="text-foreground/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                            <Youtube className="h-6 w-6" />
                            <span className="sr-only">YouTube</span>
                        </Link>)}
                        {siteSettings.pinterestUrl && (<Link href={siteSettings.pinterestUrl} className="text-foreground/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                            <PinterestIcon className="h-6 w-6" />
                            <span className="sr-only">Pinterest</span>
                        </Link>)}
                    </div>
                </>
            ) : null }
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} MRM Internationals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

    