import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

// Auth routes
auth.addHttpRoutes(http);

// Resend webhook endpoint for email events
http.route({
  path: "/webhooks/resend",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Verify webhook signature (implement based on Resend docs)
      const signature = request.headers.get("resend-signature");
      if (!signature) {
        return new Response("Missing signature", { status: 401 });
      }

      const body = await request.text();

      // Parse the webhook payload
      let payload;
      try {
        payload = JSON.parse(body);
      } catch (error) {
        return new Response("Invalid JSON", { status: 400 });
      }

      // Extract event data
      const { type, data } = payload;

      if (!type || !data) {
        return new Response("Invalid payload", { status: 400 });
      }

      // Process the webhook event
      await ctx.runMutation(internal.events.processEmailEvent, {
        type,
        data: JSON.stringify(data),
      });

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return new Response("Internal server error", { status: 500 });
    }
  }),
});

export default http;
