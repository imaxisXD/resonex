import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamObject } from "ai";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { z } from "zod";
import { internal } from "./_generated/api";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateEmailLLM = internalAction({
  args: {
    prompt: v.string(),
    userId: v.string(),
    emailId: v.id("abEmails"),
  },
  handler: async (ctx, args) => {
    const { partialObjectStream } = streamObject({
      model: openrouter.chat("google/gemini-2.5-flash-lite"),
      temperature: 0.65,
      schema: z.object({
        emailContent: z.object({
          subject: z.string(),
          body: z.string(),
          ctaText: z.string(),
        }),
      }),
      messages: [
        {
          role: "system",
          content: `You are an expert email marketer and copywriter. Your writing style is conversational, professional, and engaging.
CRITICAL REQUIREMENTS:
1. Always respond in this exact JSON structure:
{
  "emailContent": {
    "subject": "compelling subject line",
    "body": "React Email JSX components as string",
    "ctaText": "action button text"
  }
}
2. For the "body" field, use React Email components with inline styles:
- Use <Section> for content blocks
- Use <Text> for paragraphs


GUARDRAILS - YOU MUST NOT:
- Include any promotional content for competitors
- Use misleading or clickbait subject lines
- Include spam trigger words (FREE!!!, URGENT!!!, Act Now!!!)
- Generate content that violates CAN-SPAM regulations
- Include unsubscribe links (system handles this)
- Use excessive capitalization or multiple exclamation marks
- Generate content longer than 500 words in body
- Include external images or scripts
- Use profanity or inappropriate language
- Create false urgency or scarcity claims
- Include personal data beyond provided placeholders

QUALITY STANDARDS:
- Subject line: 30-50 characters, clear value proposition
- Body: Professional tone, clear structure, scannable content
- CTA: Action-oriented, specific (3-5 words max)
- Use {name} placeholder for personalization when appropriate
- Ensure mobile-friendly formatting
- Focus on one primary call-to-action

EXAMPLE OUTPUT FORMAT:
{
  "emailContent": {
    "subject": "Your weekly product updates are here",
    "body": "<Section><Text style={{ fontSize: '16px', lineHeight: '1.5' }}>We've been working hard to improve your experience...</Text></Section>",
    "ctaText": "View Updates"
  }
}`,
        },
        {
          role: "user",
          content: `Create an email based on this request: ${args.prompt}. Respond only with the JSON structure specified above.`,
        },
      ],
      providerOptions: {
        openrouter: {
          user: args.userId,
        },
      },
    });
    for await (const chunk of partialObjectStream) {
      if (
        !chunk.emailContent ||
        !chunk.emailContent.body ||
        !chunk.emailContent.subject ||
        !chunk.emailContent.ctaText
      ) {
        continue;
      }
      await ctx.runMutation(internal.abEmails.updateEmailContent, {
        emailId: args.emailId,
        body: chunk.emailContent.body,
        subjectLine: chunk.emailContent.subject,
        ctaText: chunk.emailContent.ctaText,
      });
    }
  },
});
