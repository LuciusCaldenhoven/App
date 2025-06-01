import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addReview = mutation({
  args: {
    content: v.string(),
    sellerId: v.id("users"),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (currentUser._id === args.sellerId) {
      throw new ConvexError("No puedes dejar una reseña a ti mismo.");
    }

    // Verificar si ya dejó una reseña para este producto
    

    const reviewId = await ctx.db.insert("reviews", {
      fromUserId: currentUser._id,
      toUserId: args.sellerId,
      rating: args.rating,
      comment: args.content,
      createdAt: Date.now(),
    });

    // Obtener todas las reseñas del vendedor actualizadas
    const allReviews = await ctx.db
      .query("reviews")
      .withIndex("by_to_user", (q) => q.eq("toUserId", args.sellerId))
      .collect();

    const newAverage =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await ctx.db.patch(args.sellerId, {
      reviewCount: allReviews.length,
      averageRating: newAverage,
    });

    // Crear notificación
    await ctx.db.insert("notifications", {
      receiverId: args.sellerId,
      senderId: currentUser._id,
      type: "review",
      text: args.content,
    });


    return reviewId;
  },
});

export const getReviewsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_to_user", (q) => q.eq("toUserId", args.userId))
      .collect();

    const reviewsWithInfo = await Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db.get(review.fromUserId);
        return {
          ...review,
          user: {
            fullname: user!.fullname,
            image: user!.image,
          },
        };
      })
    );

    return reviewsWithInfo;
  },
});

