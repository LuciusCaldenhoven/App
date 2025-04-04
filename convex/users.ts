import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
    args: {
        username: v.string(),
        fullname: v.string(),
        image: v.string(),
        email: v.string(),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        // create a user in db
        const existingUser = await ctx.db.query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (existingUser) return;

        // create a user in db
        await ctx.db.insert("users", {
            username: args.username,
            fullname: args.fullname,
            email: args.email,
            image: args.image,
            clerkId: args.clerkId,
            posts: 0,
            reviewCount: 0,
            averageRating: 0,

        });

    }
});


export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        return user;
    },
});



export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

    if (!currentUser) throw new Error("User not found");

    return currentUser;
}

export const updateProfile = mutation({
    args: {
        fullname: v.string(),
        bio: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        await ctx.db.patch(currentUser._id, {
            fullname: args.fullname,

        });
    },
});


export const getUserProfile = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        if (!user) throw new Error("User not found");

        return user;
    },
});

