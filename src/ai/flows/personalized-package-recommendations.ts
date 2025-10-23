'use server';

/**
 * @fileOverview A personalized travel package recommendation AI agent.
 *
 * - getPersonalizedPackageRecommendations - A function that generates personalized travel package recommendations.
 * - PersonalizedPackageRecommendationsInput - The input type for the getPersonalizedPackageRecommendations function.
 * - PersonalizedPackageRecommendationsOutput - The return type for the getPersonalizedPackageRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedPackageRecommendationsInputSchema = z.object({
  interests: z
    .string()
    .describe("The user's interests (e.g., adventure, relaxation, cultural experiences)."),
  pastBrowsingHistory: z
    .string()
    .describe("The user's past browsing history on the travel website."),
});
export type PersonalizedPackageRecommendationsInput = z.infer<
  typeof PersonalizedPackageRecommendationsInputSchema
>;

const PersonalizedPackageRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of personalized travel package recommendations based on the user input.'
    ),
});
export type PersonalizedPackageRecommendationsOutput = z.infer<
  typeof PersonalizedPackageRecommendationsOutputSchema
>;

export async function getPersonalizedPackageRecommendations(
  input: PersonalizedPackageRecommendationsInput
): Promise<PersonalizedPackageRecommendationsOutput> {
  return personalizedPackageRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedPackageRecommendationsPrompt',
  input: {schema: PersonalizedPackageRecommendationsInputSchema},
  output: {schema: PersonalizedPackageRecommendationsOutputSchema},
  prompt: `You are a travel expert specializing in personalized travel package recommendations.

You will use the user's stated interests and past browsing history to generate a list of personalized travel package recommendations.

Interests: {{{interests}}}
Past Browsing History: {{{pastBrowsingHistory}}}

Recommendations:`,
});

const personalizedPackageRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedPackageRecommendationsFlow',
    inputSchema: PersonalizedPackageRecommendationsInputSchema,
    outputSchema: PersonalizedPackageRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
