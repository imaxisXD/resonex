import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateEmailLLM = internalAction({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const { text } = await generateText({
      model: openrouter.chat("google/gemini-2.5-flash-lite"),
      prompt: args.prompt,
    });

    console.log(text);
  },
});
