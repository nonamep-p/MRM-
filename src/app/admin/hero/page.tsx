
'use client';

import { useState } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, doc } from "firebase/firestore";
import type { HeroSlide } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { HeroSlideForm } from "@/components/hero-slide-form";
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import Image from "next/image";

export default function AdminHeroPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const slidesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "heroSlides"));
  }, [firestore]);
  const { data: heroSlides, isLoading } = useCollection<HeroSlide>(slidesCollection);

  const handleAddNew = () => {
    setSelectedSlide(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setIsDialogOpen(true);
  };

  const handleDelete = (slideId: string) => {
    if (!firestore) return;
    if (confirm("Are you sure you want to delete this slide?")) {
      deleteDocumentNonBlocking(doc(firestore, "heroSlides", slideId));
      toast({
        title: "Slide Deletion Initiated",
        description: "The hero slide will be deleted shortly.",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedSlide(null);
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-headline">Manage Hero Slides</h1>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Slide
          </Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    Loading slides...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && heroSlides?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No slides found. Add your first slide!
                  </TableCell>
                </TableRow>
              )}
              {heroSlides?.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <div className="relative h-16 w-24 rounded-md overflow-hidden">
                       <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{slide.title}</TableCell>
                  <TableCell>{slide.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(slide)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(slide.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSlide ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
            <DialogDescription>
              {selectedSlide ? 'Update the details for this hero slide.' : 'Fill in the details for the new hero slide.'}
            </DialogDescription>
          </DialogHeader>
          <HeroSlideForm
            slide={selectedSlide}
            onSuccess={handleFormSuccess} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
