
"use client";

import Image from "next/image";
import Link from "next/link";
import type { TravelPackage } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Tag, MapPin, Plane, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface PackageCardProps {
  travelPackage: TravelPackage;
}

export function PackageCard({ travelPackage }: PackageCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === travelPackage.image);
  const { id, title, description, duration, price, location, inclusions } = travelPackage;

  return (
    <Dialog>
      <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full">
        <CardHeader className="p-0">
          <div className="relative h-56 w-full">
            {image && (
              <Image
                src={image.imageUrl}
                alt={title}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <CardTitle className="font-headline mb-2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex flex-col items-start mt-auto">
          <div className="w-full flex justify-between items-center mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="font-semibold text-foreground">
                      ${price.toLocaleString()}
                  </span>
              </div>
          </div>
          <div className="w-full flex gap-2">
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Quick View</Button>
            </DialogTrigger>
            <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href={`/packages/${id}`}>View Details</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{Object.keys(location).length > 0 ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Location not available'}</span>
            <span className="text-muted-foreground mx-2">|</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{duration}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="relative h-72 w-full rounded-lg overflow-hidden">
                {image && (
                    <Image
                        src={image.imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                    />
                )}
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-2 font-headline">About this package</h3>
                <p className="text-muted-foreground">{description}</p>
            </div>
            {inclusions && inclusions.length > 0 && (
                <div>
                    <h3 className="font-semibold text-lg mb-3 font-headline">What's Included</h3>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-muted-foreground">
                        {inclusions.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        <div className="flex justify-end gap-2 pt-4">
            <DialogTrigger asChild>
                <Button variant="outline">Close</Button>
            </DialogTrigger>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href={`/packages/${id}`}>
                <Plane className="mr-2 h-4 w-4" /> Go to Details
              </Link>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
