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

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.storage.generateUploadUrl();
});

export const updateProfile = mutation({
  args: {
    fullname: v.string(),
    storageId: v.optional(v.id('_storage')),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    let imageUrl = currentUser.image;

    if (args.storageId) {
      const url = await ctx.storage.getUrl(args.storageId);
      if (!url) throw new Error('No se pudo obtener la URL de la imagen');
      imageUrl = url;
    }

    await ctx.db.patch(currentUser._id, {
      fullname: args.fullname,
      ...(args.phone && { phone: args.phone }),
      ...(args.bio && { bio: args.bio }),
      ...(args.storageId && { image: imageUrl }),
    });

    return imageUrl;
  },
});

export const getImageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("No se pudo obtener la URL de la imagen");
    return url;
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


export const saveLocation = mutation({
  args: {
    location: v.optional(v.string()),
    lat: v.number(),
    lng: v.number(),
    km: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("Usuario no encontrado");

    await ctx.db.patch(currentUser._id, {
      location: args.location,
      lat: args.lat,
      lng: args.lng,
      km: args.km,
    });
  },
});
