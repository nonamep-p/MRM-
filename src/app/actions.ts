
"use server";

import { z } from "zod";
import {
  getPersonalizedPackageRecommendations as getPersonalizedPackageRecommendationsFlow,
  type PersonalizedPackageRecommendationsInput,
} from "@/ai/flows/personalized-package-recommendations";
import { getSdks } from "@/firebase/firebase-server";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import type { ContactFormSubmission } from "@/lib/types";

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

    
