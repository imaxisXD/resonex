import { ConvexError } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { QueryCtx, mutation } from "./_generated/server";

/**
 * Mutation to add a new user to the database or update existing user details if necessary.
 * @param {QueryCtx} ctx - The query context.
 * @returns {Promise<Id<"users">>} The ID of the stored or updated user.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.error("store mutation called without authentication");
      throw new Error("Called store user without authentication present");
    }
    // Check if we've already stored this identity before.
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    // If we've seen this identity before but the name has changed, patch the value.
    if (existingUser != null) {
      if (
        existingUser.name !== identity.name ||
        existingUser.email !== identity.email
      ) {
        await ctx.db.patch(existingUser._id, {
          name: identity.name,
          email: identity.email,
        });
      }

      return existingUser._id;
    } else {
      // If it's a new identity, create a new `User`.
      const user = await ctx.db.insert("users", {
        name: identity.name!,
        tokenIdentifier: identity.subject,
        email: identity.email!,
        pictureUrl: identity.pictureUrl,
      });

      return user;
    }
  },
});

// Helper functions below are used to query user details from the database.

/**
 * Queries a user by their token identifier.
 * @param {QueryCtx} ctx - The query context.
 * @param {string} clerkUserId - The user's token identifier.
 * @returns {Promise<Doc<"users"> | null>} The user document or null if not found.
 **/
export async function getUserFromClerkId(
  ctx: QueryCtx,
  clerkUserId: string,
): Promise<Doc<"users"> | null> {
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", clerkUserId))
    .unique();

  return user;
}

/**
 * Queries a user by their document ID.
 * @param {QueryCtx} ctx - The query context.
 * @param {Id<"users">} id - The document ID of the user.
 * @returns {Promise<Doc<"users"> | null>} The user document or null if not found.
 */
export async function userById(
  ctx: QueryCtx,
  id: Id<"users">,
): Promise<Doc<"users"> | null> {
  console.debug(`Querying user by ID: ${id}`);
  return await ctx.db.get(id);
}

/**
 * Retrieves the current authenticated user's details.
 * @param {QueryCtx} ctx - The query context.
 * @returns {Promise<Doc<"users"> | null>} The current user's document or null if not authenticated.
 */
export async function getCurrentUser(
  ctx: QueryCtx,
): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    console.warn("No current user identity found");
    return null;
  }
  return await getUserFromClerkId(ctx, identity.subject);
}

/**
 * Ensures a current user is available and throws an error if not.
 * @param {QueryCtx} ctx - The query context.
 * @returns {Promise<Doc<"users">>} The current user's document.
 * @throws {Error} If no current user can be retrieved.
 */
export async function mustGetCurrentUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) {
    throw new ConvexError("Can not get current user, can be unauth request");
  }
  return userRecord;
}
