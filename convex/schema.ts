import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(), // johndoe
        fullname: v.string(), // John Doe
        email: v.string(),
        image: v.string(),
        posts: v.number(),
        clerkId: v.string(),
        // Nuevos atributos para sistema de reseñas
        reviewCount: v.number(),     // Número de reseñas recibidas
        averageRating: v.number(),   // Promedio de puntaje
    }).index("by_clerk_id", ["clerkId"]),

    posts: defineTable({
        userId: v.id("users"),
        imageUrl: v.string(),
        storageId: v.id("_storage"),
        caption: v.optional(v.string()),
        likes: v.number(),
        comments: v.number(),
        // NUEVOS ATRIBUTOS PARA PRODUCTOS
        title: v.string(),
        price: v.number(),
        category: v.string(),
        location: v.string(),
        condition: v.union(v.literal("new"), v.literal("used")),
        imageUrls: v.array(v.string()),
    })
    .index("by_user", ["userId"])
    .index("by_category", ["category"])
    .index("by_price", ["price"]),

    likes: defineTable({
        userId: v.id("users"),
        postId: v.id("posts"),
    })
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),


    notifications: defineTable({
        receiverId: v.id("users"),
        senderId: v.id("users"),
        type: v.union(
            v.literal("like"),
            v.literal("comment"),
            v.literal("follow"),
            v.literal("favorite"),
            v.literal("review"),
            v.literal("message")
        ),
        postId: v.optional(v.id("posts")),
        commentId: v.optional(v.id("comments")),
    })
    .index("by_receiver", ["receiverId"])
    .index("by_post", ["postId"]),

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
        postId: v.id("posts"),
        createdAt: v.number(),
    })
    .index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"])
    .index("by_post", ["postId"]),

    messages: defineTable({
        chatId: v.id("chats"),
        senderId: v.id("users"),
        content: v.string(),
        file: v.optional(v.string()),
        createdAt: v.number(),
    }).index("by_chat", ["chatId"]),

    // NUEVA TABLA PARA RESEÑAS
    reviews: defineTable({
        fromUserId: v.id("users"),     // Usuario que deja la reseña
        toUserId: v.id("users"),       // Usuario que la recibe (vendedor)
        productId: v.id("posts"),      // Producto relacionado
        rating: v.number(),            // Valoración (1-5)
        comment: v.string(),           // Comentario
        createdAt: v.number(),         // Fecha
    })
    .index("by_to_user", ["toUserId"])                      // Buscar reseñas por usuario receptor
    .index("by_from_user_and_product", ["fromUserId", "productId"]) // Evitar reseñas duplicadas por producto
});
