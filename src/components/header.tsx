
      
'use client';

import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onContactClick: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  
  const firestore = useFirestore();
  const settingsDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "siteSettings", "main");
  }, [firestore]);
  const { data: siteSettings } = useDoc<SiteSettings>(settingsDocRef);


  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
  };

  const navLinks = [
    { name: "Packages", href: "/packages" },
    { name: "Destinations", href: "/#map" },
    { name: "Recommendations", href: "/#recommendations" },
  ];

  const logoAlignment = siteSettings?.logoAlignment || 'items-center';
  const logoSpacing = siteSettings?.logoSpacing ? `${parseInt(siteSettings.logoSpacing) * 0.25}rem` : '0.5rem';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 items-center">
        <div className="flex-1 flex justify-start">
             <Link href="/" className={cn("flex", logoAlignment)} style={{gap: logoSpacing}}>
              {siteSettings?.logoUrl && (
                <div className="relative h-12 flex-shrink-0">
                  <Image src={siteSettings.logoUrl} alt="Logo" height={48} width={150} style={{objectFit: "contain", height: "100%", width: "auto"}}/>
                </div>
              )}
              {siteSettings?.logoText && (
                <span className={cn("font-bold", siteSettings.logoTextSize)} style={{ color: siteSettings.logoTextColor, fontFamily: siteSettings.logoFontFamily }}>{siteSettings.logoText}</span>
              )}
            </Link>
        </div>
        
        <nav className="hidden md:flex justify-center">
            <div className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className="relative text-foreground/60 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-100"
                >
                {link.name}
                </Link>
            ))}
            </div>
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {!isUserLoading && user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <User className="mr-2 h-4 w-4" /> Admin
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <DialogTrigger asChild>
              <Button 
                onClick={onContactClick} 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Contact Us
              </Button>
            </DialogTrigger>
          )}
        </div>
      </div>
    </header>
  );
}
    
