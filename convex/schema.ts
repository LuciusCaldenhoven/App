import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        image: v.string(),
        posts: v.number(),
        clerkId: v.string(),
        reviewCount: v.number(),
        averageRating: v.number(),
        bio: v.optional(v.string()),
        phone: v.optional(v.string()),
        location: v.optional(v.string()),
        lat: v.optional(v.float64()),
        lng: v.optional(v.float64()),
        km: v.optional(v.number()),
        pushToken: v.optional(v.string()),
    }).index("by_clerk_id", ["clerkId"]),

    posts: defineTable({
        tipo: v.string(),
        userId: v.id("users"),
        storageId: v.id("_storage"),
        caption: v.string(),
        title: v.string(),
        price: v.number(),
        currency: v.string(),
        category: v.string(),
        location: v.string(),
        lat: v.number(),
        lng: v.number(),
        condition: v.string(),
        imageUrls: v.array(v.id("_storage")),
        sold: v.boolean(),
    })
        .index("by_user", ["userId"])
        .index("by_category", ["category"])
        .index("by_price", ["price"]),



    notifications: defineTable({
        receiverId: v.id("users"),
        senderId: v.optional(v.id("users")),
        type: v.union(
            v.literal("review"),
            v.literal("message"),
            v.literal("app")
        ),
        text: v.string(),

    })
        .index("by_receiver", ["receiverId"]),


    bookmarks: defineTable({
        userId: v.id("users"),
        postId: v.id("posts"),
    })
        .index("by_user", ["userId"])
        .index("by_post", ["postId"])
        .index("by_user_and_post", ["userId", "postId"]),

    chats: defineTable({
        buyerId: v.id("users"),
        sellerId: v.id("users"),
        lastMessage: v.optional(v.string()),
        lastTime: v.optional(v.number()),
        badge: v.optional(v.number()),
    })
        .index("by_buyer", ["buyerId"])
        .index("by_seller", ["sellerId"]),

    messages: defineTable({
        chatId: v.id("chats"),
        senderId: v.id("users"),
        content: v.string(),
        file: v.optional(v.id("_storage")),
        createdAt: v.number(),
        product: v.optional(v.id("posts")),
    }).index("by_chat", ["chatId"]),


    reviews: defineTable({
        fromUserId: v.id("users"),
        toUserId: v.id("users"),
        rating: v.number(),
        comment: v.string(),
        createdAt: v.number(),
    })
        .index("by_to_user", ["toUserId"])
});
