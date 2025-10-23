import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  const navLinks = [
    { name: "Packages", href: "#packages" },
    { name: "Destinations", href: "#map" },
    { name: "Recommendations", href: "#recommendations" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center space-x-2">
            <Compass className="h-6 w-6 text-accent" />
            <span className="font-bold sm:inline-block font-headline text-lg">
                VoyageVista
            </span>
            </Link>
        </div>
        <nav className="hidden md:flex">
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
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="#contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
