'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { SiteSettings } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const settingsSchema = z.object({
  address: z.string().min(1, "Address is required."),
  phone: z.string().min(1, "Phone number is required."),
  email: z.string().email("Invalid email address."),
  defaultCurrency: z.enum(['AED', 'USD', 'EUR', 'GBP']),
  twitterUrl: z.string().url("Must be a valid URL.").or(z.literal('')),
  instagramUrl: z.string().url("Must be a valid URL.").or(z.literal('')),
  facebookUrl: z.string().url("Must be a valid URL.").or(z.literal('')),
  linkedinUrl: z.string().url("Must be a valid URL.").or(z.literal('')),
  youtubeUrl: z.string().url("Must be a valid URL.").or(z.literal('')),
  pinterestUrl: z.string().url("Must be a valid URL.").or(z.literal('')),
  logoUrl: z.string().url("Must be a valid URL.").or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const settingsDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, "siteSettings", "main");
  }, [firestore]);

  const { data: siteSettings, isLoading } = useDoc<SiteSettings>(settingsDocRef);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      address: "",
      phone: "",
      email: "",
      defaultCurrency: 'AED',
      twitterUrl: "",
      instagramUrl: "",
      facebookUrl: "",
      linkedinUrl: "",
      youtubeUrl: "",
      pinterestUrl: "",
      logoUrl: "",
    },
  });

  const watchedLogoUrl = form.watch("logoUrl");

  useEffect(() => {
    if (siteSettings) {
      form.reset({
        ...siteSettings,
        twitterUrl: siteSettings.twitterUrl || "",
        instagramUrl: siteSettings.instagramUrl || "",
        facebookUrl: siteSettings.facebookUrl || "",
        linkedinUrl: siteSettings.linkedinUrl || "",
        youtubeUrl: siteSettings.youtubeUrl || "",
        pinterestUrl: siteSettings.pinterestUrl || "",
        logoUrl: siteSettings.logoUrl || "",
      });
    }
  }, [siteSettings, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue("logoUrl", dataUrl, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(values: SettingsFormValues) {
    if (!settingsDocRef) {
      toast({ variant: "destructive", title: "Error", description: "Firestore is not available." });
      return;
    }
    setIsSubmitting(true);
    
    setDocumentNonBlocking(settingsDocRef, values, { merge: true });
    
    toast({
      title: "Settings Updated",
      description: "Your site settings have been saved.",
    });

    setIsSubmitting(false);
  }

  if (isLoading) {
      return <div className="p-10">Loading settings...</div>
  }

  return (
    <div className="container mx-auto py-10">
       <h1 className="text-3xl font-bold font-headline mb-8">Site Settings</h1>
       <Card>
           <CardHeader>
               <CardTitle>General Settings</CardTitle>
               <CardDescription>Update general, contact, and social media settings for your site.</CardDescription>
           </CardHeader>
           <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <h3 className="text-lg font-medium">Logo Settings</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <FormLabel>Logo</FormLabel>
                         <Tabs defaultValue="url" className="mt-2">
                            <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="url">URL</TabsTrigger>
                            <TabsTrigger value="upload">Upload</TabsTrigger>
                            </TabsList>
                            <TabsContent value="url" className="pt-2">
                            <FormField
                                control={form.control}
                                name="logoUrl"
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            </TabsContent>
                            <TabsContent value="upload" className="pt-2">
                                <FormControl>
                                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                                </FormControl>
                            </TabsContent>
                        </Tabs>
                    </div>
                    {watchedLogoUrl && (
                        <div className="flex flex-col gap-2">
                            <FormLabel>Preview</FormLabel>
                            <div className="mt-4 p-2 border rounded-md bg-muted/40 h-32 flex items-center justify-center">
                                <div className="relative h-28 w-full">
                                    <Image src={watchedLogoUrl} alt="Logo preview" fill className="object-contain" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <Separator />
                
                <h3 className="text-lg font-medium">General</h3>
                 <FormField
                  control={form.control}
                  name="defaultCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a default currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                       <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />
                
                <h3 className="text-lg font-medium">Contact Information</h3>
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                        <Input placeholder="123 Adventure Ave, Wanderlust City" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                            <Input placeholder="+1 (234) 567-890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                            <Input placeholder="hello@mrminternationals.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                <Separator />
                
                <h3 className="text-lg font-medium">Social Media URLs (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="twitterUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Twitter URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://twitter.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="instagramUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instagram URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://instagram.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="facebookUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Facebook URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://facebook.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>LinkedIn URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://linkedin.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="youtubeUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>YouTube URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://youtube.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="pinterestUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pinterest URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://pinterest.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
                </form>
            </Form>
           </CardContent>
       </Card>
      
    </div>
  );
}
