import { v } from "convex/values";
import { mutation, MutationCtx, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
    args: {
        tipo: v.string(),
        caption: v.optional(v.string()),
        storageId: v.id("_storage"),
        title: v.string(),
        price: v.number(),
        currency: v.string(),
        category: v.string(),
        location: v.string(),
        condition: v.string(),
        imageUrls: v.array(v.id("_storage")), // 🔥 Ahora recibe storageId, no strings
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const imageUrl = await ctx.storage.getUrl(args.storageId);
        if (!imageUrl) throw new Error("Image not found");

        // ✅ Convertir cada storageId en una URL real
        const imageUrls = await Promise.all(
            args.imageUrls.map(async (storageId) => {
                const url = await ctx.storage.getUrl(storageId);
                return url || "";
            })
        );

        // ✅ Guardar los datos en la BD con URLs completas
        const postId = await ctx.db.insert("posts", {
            tipo: args.tipo,
            userId: currentUser._id,
            imageUrl, // 🔥 Imagen principal con URL real
            storageId: args.storageId,
            caption: args.caption,
            title: args.title,
            price: args.price,
            category: args.category,
            location: args.location,
            condition: args.condition,
            currency: args.currency,
            imageUrls,
        });

        await ctx.db.patch(currentUser._id, {
            posts: currentUser.posts + 1
        });

        return postId;
    },
});


export const getFeedPosts = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const posts = await ctx.db.query("posts").order("desc").collect();

        if (posts.length === 0) return [];

        const postsWithInfo = await Promise.all(
            posts.map(async (post) => {
                const postAuthor = (await ctx.db.get(post.userId))!;



                const bookmark = await ctx.db
                    .query("bookmarks")
                    .withIndex("by_user_and_post", (q) =>
                        q.eq("userId", currentUser._id).eq("postId", post._id)
                    )
                    .first();
                return {
                    ...post,
                    author: {
                        _id: postAuthor?._id,
                        username: postAuthor?.username,
                        image: postAuthor?.image
                    },

                    isBookmarked: !!bookmark
                };
            })
        );


        return postsWithInfo;
    }
});


export const getFilteredProductCount = query({
    args: {
        type: v.optional(v.string()),
        condition: v.optional(v.string()),
        priceRange: v.optional(v.array(v.number())),
        date: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let query = ctx.db.query("posts");

        // Filtrar por tipo
        if (args.type) {
            query = query.filter((q) => q.eq(q.field("tipo"), args.type));
        }


        // Filtrar por condición
        if (args.condition) {
            // Asegúrate de que args.condition sea un array
            const conditions = Array.isArray(args.condition)
                ? args.condition
                : args.condition.split(","); // Convierte la cadena en un array
        
            console.log("Condiciones procesadas:", conditions);
        
            query = query.filter((q) =>
                q.or(...conditions.map((cond) => q.eq(q.field("condition"), cond)))
            );
        }

        // Filtrar por rango de precios
        if (args.priceRange) {
            const [minPrice, maxPrice] = args.priceRange;
            query = query.filter((q) =>
                q.and(
                    q.gte(q.field("price"), minPrice),
                    q.lte(q.field("price"), maxPrice)
                )
            );
        }

        // Filtrar por fecha de publicación
        if (args.date) {
            const now = Date.now(); // Obtén la marca de tiempo actual
            let dateLimit: number | undefined;
        
            if (args.date === "Ultimas 24 horas") {
                dateLimit = now - 24 * 60 * 60 * 1000; // Últimas 24 horas
            } else if (args.date === "Ultimos 7 dias") {
                dateLimit = now - 7 * 24 * 60 * 60 * 1000; // Últimos 7 días
            } else if (args.date === "Ultimos 30 dias") {
                dateLimit = now - 30 * 24 * 60 * 60 * 1000; // Últimos 30 días
            }
        
            if (dateLimit) {
                query = query.filter((q) => q.gte(q.field("_creationTime"), dateLimit));
            }
        }

        // Devuelve el número de productos que coinciden con los filtros
        const results = await query.collect();

        return results.length;
    },
});

export const deletePost = mutation({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error("Post not found");

        // verify ownership
        if (post.userId !== currentUser._id) throw new Error("Not authorized to delete this post");




        // delete associated comments
        const bookmarks = await ctx.db
            .query("bookmarks")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .collect();

        for (const bookmark of bookmarks) {
            await ctx.db.delete(bookmark._id);
        }
        // todo: delete associated notifications
        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .collect();

        for (const notification of notifications) {
            await ctx.db.delete(notification._id);
        }

        // delete the post
        await ctx.db.delete(args.postId);

        // decrement user's post count by 1
        await ctx.db.patch(currentUser._id, {
            posts: Math.max(0, (currentUser.posts || 0) - 1),
        });


    },
});

export const getPostsByUser = query({
    args: {
        userId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const user = args.userId ? await ctx.db.get(args.userId) : await getAuthenticatedUser(ctx);

        if (!user) throw new Error("User not found");

        const posts = await ctx.db
            .query("posts")
            .withIndex("by_user", (q) => q.eq("userId", args.userId || user._id))
            .collect();

        return posts;
    },
});

export const getPostById = query({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error("Post not found");

        const author = await ctx.db.get(post.userId); // Obtener datos del autor

        return {
            ...post,
            author: {
                _id: author?._id,
                username: author?.username,
                image: author?.image,
            },
        };
    },
});

export const getBookmarkedPostById = query({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        const post = await ctx.db.get(args.postId);

        if (!post) throw new Error("Post not found");

        const bookmark = await ctx.db
            .query("bookmarks")
            .withIndex("by_user_and_post", (q) =>
                q.eq("userId", currentUser._id).eq("postId", post._id)
            )
            .first();

        return {
            ...post,
            isBookmarked: !!bookmark, // ✅ Ahora sabemos si está guardado en favoritos o no
        };
    }
});
