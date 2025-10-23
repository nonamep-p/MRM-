'use client';

import Link from "next/link";
import Image from "next/image";
import { LogOut, User, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { useState } from "react";

interface HeaderProps {
  onContactClick: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
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
  
  const contactLink = { name: "Contact Us", href: "/#contact"};

  const logoAlignment = siteSettings?.logoAlignment || 'items-center';
  const logoSpacing = siteSettings?.logoSpacing ? `${parseInt(siteSettings.logoSpacing) * 0.25}rem` : '0.5rem';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center px-4 md:px-6">
        <div className="flex-1 flex items-center justify-start">
          <Link href="/" className={cn("flex items-center", logoAlignment)} style={{gap: logoSpacing}}>
            {siteSettings?.logoUrl && (
              <div className="relative h-10 md:h-12 flex-shrink-0">
                <Image src={siteSettings.logoUrl} alt="Logo" height={48} width={150} style={{objectFit: "contain", height: "100%", width: "auto"}}/>
              </div>
            )}
            {siteSettings?.logoText && (
              <span className={cn("font-bold", siteSettings.logoTextSize)} style={{ color: siteSettings.logoTextColor, fontFamily: siteSettings.logoFontFamily }}>{siteSettings.logoText}</span>
            )}
          </Link>
        </div>
        
        <nav className="hidden md:flex flex-1 justify-center items-center">
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
        
        <div className="flex-1 flex justify-end items-center">
          {!isUserLoading && user ? (
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <User className="mr-2 h-4 w-4" /> Admin
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          ) : !user && (
            <>
              <div className="hidden md:flex items-center">
                   <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href={contactLink.href} onClick={(e) => { e.preventDefault(); onContactClick(); }}>{contactLink.name}</Link>
                  </Button>
              </div>
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[300px] p-0">
                    <div className="flex flex-col h-full">
                       <div className="p-6 border-b">
                         <Link href="/" className={cn("flex", logoAlignment)} style={{gap: logoSpacing}} onClick={() => setIsSheetOpen(false)}>
                           {siteSettings?.logoUrl && <div className="relative h-10 flex-shrink-0"><Image src={siteSettings.logoUrl} alt="Logo" height={40} width={120} style={{objectFit: "contain"}}/></div>}
                           {siteSettings?.logoText && <span className={cn("font-bold", siteSettings.logoTextSize)} style={{color: siteSettings.logoTextColor}}>{siteSettings.logoText}</span>}
                         </Link>
                       </div>
                       <nav className="flex flex-col space-y-2 p-6 text-lg">
                          {navLinks.map((link) => (
                              <SheetClose asChild key={link.href}>
                                <Link href={link.href} className="text-foreground/80 hover:text-foreground p-2 rounded-md transition-colors hover:bg-accent/10">{link.name}</Link>
                              </SheetClose>
                          ))}
                       </nav>
                       <div className="mt-auto p-6 border-t">
                          <SheetClose asChild>
                            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={onContactClick}>
                              {contactLink.name}
                            </Button>
                          </SheetClose>
                       </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
