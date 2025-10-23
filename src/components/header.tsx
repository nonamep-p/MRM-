
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
  SheetClose,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useState } from "react";

export function Header({ onContactClick }: { onContactClick?: () => void }) {
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

  const logoAlignment = siteSettings?.logoAlignment || 'items-center';
  const logoSpacing = siteSettings?.logoSpacing ? `${parseInt(siteSettings.logoSpacing) * 0.25}rem` : '0.5rem';

  const Logo = () => (
    <Link href="/" className={cn("flex items-center shrink-0", logoAlignment)} style={{gap: logoSpacing}}>
      {siteSettings?.logoUrl && (
        <div className="relative h-10 md:h-12 flex-shrink-0">
          <Image src={siteSettings.logoUrl} alt="Logo" height={48} width={150} style={{objectFit: "contain", height: "100%", width: "auto"}}/>
        </div>
      )}
      {siteSettings?.logoText && (
        <span className={cn("font-bold", siteSettings.logoTextSize)} style={{ color: siteSettings.logoTextColor, fontFamily: siteSettings.logoFontFamily }}>{siteSettings.logoText}</span>
      )}
    </Link>
  );

  const NavMenu = ({ isMobile = false }) => {
    const navContent = navLinks.map((link) => {
        const linkElement = (
            <Link
                href={link.href}
                className={cn(
                    "relative text-foreground/60 transition-colors hover:text-foreground",
                    isMobile
                        ? "p-2 rounded-md hover:bg-accent/10 w-full text-left"
                        : "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-100"
                )}
            >
                {link.name}
            </Link>
        );

        if (isMobile) {
            return (
                <SheetClose asChild key={link.href}>
                    {linkElement}
                </SheetClose>
            );
        }
        return (
            <div key={link.href}>
                {linkElement}
            </div>
        );
    });

    return (
        <nav className={cn("items-center text-sm font-medium", isMobile ? "flex flex-col space-y-2 p-6 text-lg" : "hidden md:flex space-x-6")}>
            {navContent}
        </nav>
    );
};
  
  const ActionButtons = ({ isMobile = false }) => (
     <div className={cn("items-center shrink-0", isMobile ? "mt-auto p-6 border-t" : "flex")}>
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
         <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground w-full" onClick={onContactClick ? onContactClick : undefined}>
            {onContactClick ? <span>Contact Us</span> : <Link href="/#contact">Contact Us</Link>}
         </Button>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="md:hidden flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-[300px] p-0 flex flex-col">
              <SheetHeader className="p-4 border-b">
                 <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <NavMenu isMobile={true} />
              <ActionButtons isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="hidden md:flex">
          <Logo />
        </div>
        
        <div className="flex-grow flex justify-center">
          <NavMenu />
        </div>
        
        <div className="flex justify-end">
          <div className="md:hidden">
            <Logo />
          </div>
          <div className="hidden md:flex">
            <ActionButtons />
          </div>
        </div>

      </div>
    </header>
  );
}
