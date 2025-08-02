import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { resend } from "./abEmails";

export const sendFeedback = mutation({
  args: {
    feedback: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }
    await resend.sendEmail(ctx, {
      from: "Resonex Feedback <support@campagin.resonex.cc>",
      to: "sunny735084@gmail.com",
      subject: "Feedback from " + user.email,
      text: args.feedback,
    });
    return {
      success: true,
    };
  },
});
