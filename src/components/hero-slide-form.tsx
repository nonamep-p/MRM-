
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useFirestore } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { HeroSlide } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const slideSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  imageUrl: z.string().url("Please enter a valid image URL or upload a file."),
});

type SlideFormValues = z.infer<typeof slideSchema>;

interface HeroSlideFormProps {
  slide?: HeroSlide | null;
  onSuccess: () => void;
}

export function HeroSlideForm({ slide, onSuccess }: HeroSlideFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<SlideFormValues>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  const watchedImageUrl = form.watch("imageUrl");

  useEffect(() => {
    if (watchedImageUrl) {
      setImagePreview(watchedImageUrl);
    }
  }, [watchedImageUrl]);

  useEffect(() => {
    if (slide) {
      form.reset(slide);
      setImagePreview(slide.imageUrl);
    } else {
      form.reset({ title: "", description: "", imageUrl: "" });
      setImagePreview(null);
    }
  }, [slide, form]);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue("imageUrl", dataUrl);
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: SlideFormValues) {
    if (!firestore) {
      toast({ variant: "destructive", title: "Error", description: "Firestore is not available." });
      return;
    }
    setIsSubmitting(true);
    
    if (slide) {
      // Update existing slide
      const slideRef = doc(firestore, "heroSlides", slide.id);
      setDocumentNonBlocking(slideRef, values, { merge: true });
      toast({
        title: "Slide Updated",
        description: `The hero slide has been successfully updated.`,
      });
    } else {
      // Add new slide
      const collectionRef = collection(firestore, "heroSlides");
      addDocumentNonBlocking(collectionRef, values);
      toast({
        title: "Slide Added",
        description: `The new hero slide has been successfully added.`,
      });
    }
    setIsSubmitting(false);
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Your Journey Begins Here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief, catchy description for the slide..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <FormLabel>Image</FormLabel>
              <Tabs defaultValue="url" className="mt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="pt-2">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="upload" className="pt-2">
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={handleImageUpload} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                    </FormControl>
                </TabsContent>
              </Tabs>
            </div>
             {imagePreview && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Preview</FormLabel>
                  <div className="relative w-full h-40 rounded-md border bg-muted overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Slide image preview"
                        fill
                        className="object-cover"
                      />
                  </div>
                </div>
            )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {slide ? "Update Slide" : "Create Slide"}
        </Button>
      </form>
    </Form>
  );
}
