
"use server";

import { z } from "zod";
import {
  getPersonalizedPackageRecommendations as getPersonalizedPackageRecommendationsFlow,
  type PersonalizedPackageRecommendationsInput,
} from "@/ai/flows/personalized-package-recommendations";
import { getSdks } from "@/firebase/firebase-server";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import type { ContactFormSubmission } from "@/lib/types";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  message: z.string().min(10, "Message is too short."),
  travelers: z.coerce.number().optional(),
  travelDates: z.string().optional(),
  budget: z.string().optional(),
  interests: z.string().optional(),
  sourcePackage: z.string().optional(),
});

export async function handleContactForm(values: z.infer<typeof contactSchema>) {
  const validatedData = contactSchema.parse(values);
  
  const { firestore } = getSdks();
  
  try {
    const submissionsCollection = collection(firestore, "contactFormSubmissions");
    await addDoc(submissionsCollection, {
      ...validatedData,
      submittedAt: serverTimestamp(),
      status: 'Pending', // Default status
    });
    return { success: true, message: "Form submitted successfully." };
  } catch (error) {
    console.error("Error saving contact form submission:", error);
    return { success: false, message: "Failed to submit form. Please try again." };
  }
}

export async function updateSubmissionStatus(submissionId: string, status: ContactFormSubmission['status']) {
    const { firestore } = getSdks();
    try {
        const submissionRef = doc(firestore, 'contactFormSubmissions', submissionId);
        await updateDoc(submissionRef, { status });
        return { success: true, message: `Status updated to ${status}` };
    } catch (error) {
        console.error("Error updating submission status:", error);
        return { success: false, message: "Failed to update status." };
    }
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

    