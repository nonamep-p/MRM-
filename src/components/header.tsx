
"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SiteSettings } from "@/lib/types";

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center gap-2">
              {siteSettings?.logoIconUrl ? (
                <>
                  <div className="relative h-8 w-8">
                    <Image src={siteSettings.logoIconUrl} alt="MRM Internationals Logo" fill className="object-contain" />
                  </div>
                  <div className="flex flex-col">
                    {siteSettings.logoTextUrl && (
                      <div className="relative h-4 w-24">
                        <Image src={siteSettings.logoTextUrl} alt="Internationals" fill className="object-contain" />
                      </div>
                    )}
                    {siteSettings.logoSubtextUrl && (
                      <div className="relative h-3 w-28">
                        <Image src={siteSettings.logoSubtextUrl} alt="Travel & Tourism" fill className="object-contain" />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <span className="font-bold">MRM Internationals</span>
              )}
            </Link>
        </div>
        <nav className="hidden md:flex flex-1 items-center justify-center">
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

    