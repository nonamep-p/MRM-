import Image from "next/image";
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
import { Clock, Tag } from "lucide-react";

interface PackageCardProps {
  travelPackage: TravelPackage;
}

export function PackageCard({ travelPackage }: PackageCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === travelPackage.image);

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full">
          {image && (
            <Image
              src={image.imageUrl}
              alt={travelPackage.title}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline mb-2">{travelPackage.title}</CardTitle>
        <CardDescription>{travelPackage.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col items-start">
        <div className="w-full flex justify-between items-center mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{travelPackage.duration}</span>
            </div>
            <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="font-semibold text-foreground">
                    ${travelPackage.price.toLocaleString()}
                </span>
            </div>
        </div>
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">View Details</Button>
      </CardFooter>
    </Card>
  );
}
