
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase";
import { addDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { TravelPackage } from "@/lib/types";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";

const packageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  image: z.string().url("Please enter a valid image URL."),
  duration: z.string().min(2, "Duration is required."),
  location: z.object({
    lat: z.coerce.number().min(-90).max(90, "Latitude must be between -90 and 90."),
    lng: z.coerce.number().min(-180).max(180, "Longitude must be between -180 and 180."),
  }),
  grade: z.enum(['Luxury', 'Comfort', 'Adventure']),
  inclusions: z.array(z.object({ value: z.string().min(1, "Inclusion cannot be empty.") })).optional(),
  exclusions: z.array(z.object({ value: z.string().min(1, "Exclusion cannot be empty.") })).optional(),
  itinerary: z.array(z.object({
    day: z.coerce.number().positive(),
    title: z.string().min(1, "Itinerary title cannot be empty."),
    description: z.string().min(1, "Itinerary description cannot be empty."),
  })).optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface PackageFormProps {
  travelPackage?: TravelPackage | null;
  onSuccess: () => void;
}

export function PackageForm({ travelPackage, onSuccess }: PackageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      image: "",
      duration: "",
      location: { lat: 0, lng: 0 },
      grade: 'Comfort',
      inclusions: [],
      exclusions: [],
      itinerary: [],
    },
  });
  
  const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({
    control: form.control,
    name: "inclusions",
  });
  
  const { fields: exclusionFields, append: appendExclusion, remove: removeExclusion } = useFieldArray({
    control: form.control,
    name: "exclusions",
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control: form.control,
    name: "itinerary",
  });


  useEffect(() => {
    if (travelPackage) {
      form.reset({
        ...travelPackage,
        inclusions: travelPackage.inclusions?.map(v => ({value: v})) || [],
        exclusions: travelPackage.exclusions?.map(v => ({value: v})) || [],
        itinerary: travelPackage.itinerary || [],
      });
    } else {
      form.reset();
    }
  }, [travelPackage, form]);

  async function onSubmit(values: PackageFormValues) {
    if (!firestore) {
      toast({ variant: "destructive", title: "Error", description: "Firestore is not available." });
      return;
    }
    setIsSubmitting(true);

    const dataToSave = {
      ...values,
      inclusions: values.inclusions?.map(i => i.value),
      exclusions: values.exclusions?.map(e => e.value),
    };
    
    try {
      if (travelPackage) {
        // Update existing package
        const packageRef = doc(firestore, "travelPackages", travelPackage.id);
        await setDoc(packageRef, dataToSave, { merge: true });
        toast({
          title: "Package Updated",
          description: `"${values.title}" has been successfully updated.`,
        });
      } else {
        // Add new package
        const collectionRef = collection(firestore, "travelPackages");
        await addDoc(collectionRef, dataToSave);
        toast({
          title: "Package Added",
          description: `"${values.title}" has been successfully added.`,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving package: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving the package. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Parisian Dreams" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 7 Days" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief overview of the travel package..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1499" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="location.lat"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="48.8566" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="location.lng"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="2.3522" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Comfort">Comfort</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Inclusions</h3>
          {inclusionFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`inclusions.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mb-2">
                  <FormControl>
                    <Input {...field} placeholder="e.g., Round-trip flights" />
                  </FormControl>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeInclusion(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendInclusion({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Inclusion
          </Button>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Exclusions</h3>
          {exclusionFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`exclusions.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mb-2">
                  <FormControl>
                    <Input {...field} placeholder="e.g., Travel insurance" />
                  </FormControl>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeExclusion(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendExclusion({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Exclusion
          </Button>
        </div>
        
        <Separator />

        <div>
            <h3 className="text-lg font-medium mb-4">Itinerary</h3>
            {itineraryFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md mb-4 space-y-4 relative">
                    <FormField
                        control={form.control}
                        name={`itinerary.${index}.day`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Day</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`itinerary.${index}.title`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g., Arrival in Paris" /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`itinerary.${index}.description`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeItinerary(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
             <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendItinerary({ day: itineraryFields.length + 1, title: "", description: "" })}
             >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Itinerary Day
            </Button>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {travelPackage ? "Update Package" : "Create Package"}
        </Button>
      </form>
    </Form>
  );
}
