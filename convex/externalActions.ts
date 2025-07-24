"use node";
import { Resend } from "resend";
import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import OpenAI from "openai";
import { getAuthUserId } from "@convex-dev/auth/server";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Send campaign batch via Resend
export const sendCampaignBatch = internalAction({
  args: {
    campaignId: v.id("campaigns"),
    variant: v.union(v.literal("A"), v.literal("B")),
  },
  handler: async (ctx, args) => {
    // Get campaign details
    const campaign = await ctx.runQuery(internal.emails.getCampaignForSending, {
      campaignId: args.campaignId,
    });

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Split recipients for A/B testing (50/50 split)
    const totalRecipients = campaign.recipients.length;
    const halfPoint = Math.floor(totalRecipients / 2);
    const variantRecipients =
      args.variant === "A"
        ? campaign.recipients.slice(0, halfPoint)
        : campaign.recipients.slice(halfPoint);

    const subjectLine =
      args.variant === "A" ? campaign.subjectLines.A : campaign.subjectLines.B;

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    const emailIds: string[] = [];

    for (let i = 0; i < variantRecipients.length; i += batchSize) {
      const batch = variantRecipients.slice(i, i + batchSize);

      try {
        const result = await resend.emails.send({
          from: "Resonex <newsletter@yourdomain.com>", // Configure your domain
          to: batch,
          subject: subjectLine,
          html: campaign.body,
          // Add tracking for webhooks
          tags: [
            { name: "campaign_id", value: args.campaignId },
            { name: "variant", value: args.variant },
          ],
        });

        if (result.data?.id) {
          emailIds.push(result.data.id);
        }

        // Small delay between batches to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `Failed to send batch for campaign ${args.campaignId}:`,
          error,
        );
        // Continue with other batches even if one fails
      }
    }

    // Update campaign with sent email IDs
    await ctx.runMutation(internal.emails.updateCampaignEmailIds, {
      campaignId: args.campaignId,
      variant: args.variant,
      emailIds,
    });

    // Mark campaign as sent if both variants are complete
    const otherVariant = args.variant === "A" ? "B" : "A";
    const updatedCampaign = await ctx.runQuery(
      internal.emails.getCampaignForSending,
      {
        campaignId: args.campaignId,
      },
    );

    if (updatedCampaign?.resendEmailIds?.[otherVariant]?.length) {
      await ctx.runMutation(internal.emails.markCampaignAsSent, {
        campaignId: args.campaignId,
      });
    }

    return null;
  },
});

// Send test email
export const sendTestEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const result = await resend.emails.send({
        from: "Resonex <newsletter@yourdomain.com>", // Configure your domain
        to: [args.to],
        subject: `[TEST] ${args.subject}`,
        html: args.body,
        tags: [{ name: "type", value: "test" }],
      });

      return {
        success: true,
        emailId: result.data?.id,
      };
    } catch (error) {
      console.error("Failed to send test email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Generate newsletter content using OpenAI
export const generateNewsletterContent = action({
  args: {
    prompt: v.string(),
    category: v.string(),
  },
  returns: v.object({
    subjectLines: v.object({
      A: v.string(),
      B: v.string(),
    }),
    body: v.string(),
    recommendedTimes: v.array(
      v.object({
        dayOfWeek: v.string(),
        hour: v.number(),
        score: v.number(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Generate subject lines and body using OpenAI
    const systemPrompt = `You are an expert email marketing copywriter. Generate engaging newsletter content that drives high open rates and engagement.

Response format should be JSON:
{
  "subjectLineA": "First subject line variant (direct/informative style)",
  "subjectLineB": "Second subject line variant (curiosity/benefit style)", 
  "body": "Complete HTML email body with header, main content, and CTA"
}

Guidelines:
- Subject lines should be 30-50 characters
- Body should include: compelling header, 2-3 main sections, clear CTA
- Use HTML formatting for the body
- Match the tone to the category: ${args.category}
- Include relevant emojis sparingly`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Create newsletter content for: ${args.prompt}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("Failed to generate newsletter content");
    }

    let parsedResponse;
    try {
      console.log("response", response);
      parsedResponse = JSON.parse(response);
    } catch (error) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Get recommended send times (placeholder for now - will be enhanced by recommendation engine)
    const recommendedTimes = [
      { dayOfWeek: "Tuesday", hour: 10, score: 0.85 },
      { dayOfWeek: "Wednesday", hour: 14, score: 0.82 },
      { dayOfWeek: "Thursday", hour: 9, score: 0.78 },
    ];

    return {
      subjectLines: {
        A: parsedResponse.subjectLineA,
        B: parsedResponse.subjectLineB,
      },
      body: parsedResponse.body,
      recommendedTimes,
    };
  },
});
