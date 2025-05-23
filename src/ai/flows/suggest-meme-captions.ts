// src/ai/flows/suggest-meme-captions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting meme captions based on an uploaded image.
 *
 * - suggestMemeCaptions - A function that takes an image data URI and returns suggested meme captions.
 * - SuggestMemeCaptionsInput - The input type for the suggestMemeCaptions function.
 * - SuggestMemeCaptionsOutput - The output type for the suggestMemeCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMemeCaptionsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to generate meme captions for, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestMemeCaptionsInput = z.infer<typeof SuggestMemeCaptionsInputSchema>;

const SuggestMemeCaptionsOutputSchema = z.object({
  captions: z.array(z.string()).describe('An array of suggested meme captions.'),
});
export type SuggestMemeCaptionsOutput = z.infer<typeof SuggestMemeCaptionsOutputSchema>;

export async function suggestMemeCaptions(input: SuggestMemeCaptionsInput): Promise<SuggestMemeCaptionsOutput> {
  return suggestMemeCaptionsFlow(input);
}

const suggestMemeCaptionsPrompt = ai.definePrompt({
  name: 'suggestMemeCaptionsPrompt',
  input: {schema: SuggestMemeCaptionsInputSchema},
  output: {schema: SuggestMemeCaptionsOutputSchema},
  prompt: `You are a meme expert. Given an image, you will suggest several relevant and funny meme captions.

Image: {{media url=photoDataUri}}

Please suggest at least 3 meme captions that would be appropriate for this image:

{{#each captions}}
- {{this}}
{{/each}}`,
});

const suggestMemeCaptionsFlow = ai.defineFlow(
  {
    name: 'suggestMemeCaptionsFlow',
    inputSchema: SuggestMemeCaptionsInputSchema,
    outputSchema: SuggestMemeCaptionsOutputSchema,
  },
  async input => {
    const {output} = await suggestMemeCaptionsPrompt(input);
    return output!;
  }
);
