"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2, Loader2 } from "lucide-react";
import { getPersonalizedPackageRecommendations } from "@/app/actions";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recommendationSchema = z.object({
  interests: z.string().min(3, "Please describe your interests."),
  pastBrowsingHistory: z.string().optional(),
});

type RecommendationInput = z.infer<typeof recommendationSchema>;

export function PersonalizedRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecommendationInput>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      interests: "",
      pastBrowsingHistory: "",
    },
  });

  async function onSubmit(data: RecommendationInput) {
    setIsLoading(true);
    setRecommendations(null);
    setError(null);
    try {
      const result = await getPersonalizedPackageRecommendations(data);
      setRecommendations(result.recommendations);
    } catch (e) {
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div className="space-y-4">
        <Wand2 className="h-10 w-10 text-accent" />
        <h2 className="text-3xl md:text-4xl font-bold font-headline">
          Find Your Perfect Trip
        </h2>
        <p className="text-lg text-muted-foreground">
          Not sure where to go? Let our AI travel expert suggest the perfect
          package based on your interests. Tell us what you love, and we'll
          find your next adventure.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Tell Us What You Like</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Interests</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., sunny beaches, ancient history, hiking"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What kind of vacation are you dreaming of?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastBrowsingHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Destinations (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., enjoyed Italy, looked at cruises"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any places you've visited or browsed that you liked?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Generating..." : "Get Recommendations"}
              </Button>
            </form>
          </Form>

          {isLoading && (
             <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">Our AI is crafting your personalized suggestions...</p>
             </div>
          )}

          {error && (
            <p className="mt-6 text-sm text-destructive">{error}</p>
          )}

          {recommendations && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Here's what we found for you:</h3>
              <div className="prose prose-sm max-w-none text-foreground p-4 bg-primary/20 rounded-md">
                <p>{recommendations}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
