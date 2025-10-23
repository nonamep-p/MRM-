"use server";

import { z } from "zod";
import {
  getPersonalizedPackageRecommendations as getPersonalizedPackageRecommendationsFlow,
  type PersonalizedPackageRecommendationsInput,
} from "@/ai/flows/personalized-package-recommendations";

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export async function handleContactForm(values: z.infer<typeof contactSchema>) {
  const validatedData = contactSchema.parse(values);
  console.log("New contact form submission:", validatedData);
  // Here you would typically send an email, save to a database, etc.
  return { success: true, message: "Form submitted successfully." };
}

export async function getPersonalizedPackageRecommendations(
  input: PersonalizedPackageRecommendationsInput
) {
  // Add a default for past browsing history if it's empty
  const flowInput: PersonalizedPackageRecommendationsInput = {
    interests: input.interests,
    pastBrowsingHistory: input.pastBrowsingHistory || 'none',
  };
  
  const recommendations = await getPersonalizedPackageRecommendationsFlow(flowInput);
  return recommendations;
}
