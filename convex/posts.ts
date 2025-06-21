import { v, VAny, VFloat64 } from "convex/values";
import { internalMutation, internalQuery, mutation, MutationCtx, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthenticatedUser } from "./users";
import Fuse from "fuse.js";

import { paginationOptsValidator } from "convex/server";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) throw new Error("Unauthorized");

  return await ctx.storage.generateUploadUrl();
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("URL not found");
    return url;
  },
});


export const createPost = mutation({
  args: {
    tipo: v.string(),
    caption: v.string(),
    storageId: v.id("_storage"),
    title: v.string(),
    price: v.number(),
    currency: v.string(),
    category: v.string(),
    location: v.string(),
    condition: v.string(),
    imageUrls: v.array(v.id("_storage")),
    sold: v.boolean(),
    lat: v.float64(),
    lng: v.float64()
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const imageUrlsToStore = args.imageUrls.length > 1 ? args.imageUrls.slice(1) : [];

    const postId = await ctx.db.insert("posts", {
      tipo: args.tipo,
      userId: currentUser._id,
      storageId: args.storageId, // ID de imagen principal
      caption: args.caption,
      title: args.title,
      price: args.price,
      category: args.category,
      location: args.location,
      condition: args.condition,
      currency: args.currency,
      imageUrls: imageUrlsToStore,
      sold: args.sold,
      lat: args.lat,
      lng: args.lng,
    });

    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});



export const getFeedPosts = query({
  args: {
    paginationOpts: paginationOptsValidator, // ✅ requerido
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const { page, isDone, continueCursor } = await ctx.db
      .query("posts")
      .order("desc")
      .paginate(args.paginationOpts);

    const postsWithInfo = await Promise.all(
      page.map(async (post) => {
        const postAuthor = await ctx.db.get(post.userId);
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
            image: postAuthor?.image,
          },
          isBookmarked: !!bookmark,
        };
      })
    );

    return {
      page: postsWithInfo,
      isDone,
      continueCursor,
    };
  },
});

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export const getFilteredPosts = query({
  args: {
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    type: v.optional(v.string()),
    condition: v.optional(v.string()),
    priceRange: v.optional(v.array(v.number())),
    date: v.optional(v.string()),
    order: v.optional(
      v.union(
        v.literal("recientes"),
        v.literal("precio_asc"),
        v.literal("precio_desc")
      )
    ),
    location: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
        km: v.number(),
      })
    ),
    paginationOpts: paginationOptsValidator,
  },


  handler: async (ctx, args) => {


    const currentUser = await getAuthenticatedUser(ctx);
    let q = ctx.db.query("posts");

    // Aplicar otros filtros primero
    if (args.category) {
      q = q.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.type) {
      q = q.filter((q) => q.eq(q.field("tipo"), args.type));
    }

    if (args.condition) {
      const conditions = args.condition.split(",");
      q = q.filter((q) =>
        q.or(...conditions.map((c) => q.eq(q.field("condition"), c)))
      );
    }

    if (args.priceRange) {
      const [min, max] = args.priceRange;
      q = q.filter((q) =>
        q.and(q.gte(q.field("price"), min), q.lte(q.field("price"), max))
      );
    }

    if (args.date) {
      const now = Date.now();
      const days = {
        "Ultimas 24 horas": 1,
        "Ultimos 7 dias": 7,
        "Ultimos 30 dias": 30,
      }[args.date];

      if (days) {
        const limit = now - days * 24 * 60 * 60 * 1000;
        q = q.filter((q) => q.gte(q.field("_creationTime"), limit));
      }
    }


    // Obtener los resultados con paginación
    const { page, isDone, continueCursor } = await q.paginate(args.paginationOpts);

    // Aplicar búsqueda por título usando Fuse.js si hay un título
    let filteredPage = page;
    if (args.title) {
      const fuseOptions = {
        keys: ['title'],
        threshold: 0.4, // Ajusta este valor entre 0 y 1 (0 = coincidencia exacta, 1 = coincidencia más flexible)
        includeScore: true,
        
      };
      const fuse = new Fuse(filteredPage, fuseOptions);
      const searchResults = fuse.search(args.title);
      
      filteredPage = searchResults.map(result => result.item);
      
    }
    
    // Filtrar por ubicación si es necesario
    if (args.location) {
      const { lat, lng, km } = args.location;
      filteredPage = filteredPage.filter((post) => {
        if (post.lat === undefined || post.lng === undefined) return false;
        return distanceKm(lat, lng, post.lat, post.lng) <= km;
      });
    }

    // Enriquecer con información de autor y bookmarks
    const postsWithInfo = await Promise.all(
      filteredPage.map(async (post) => {
        const postAuthor = await ctx.db.get(post.userId);
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
            image: postAuthor?.image,
          },
          isBookmarked: !!bookmark,
        };
      })
    );

    return {
      page: postsWithInfo,
      isDone,
      continueCursor,
    };
  },
});


export const getFilteredStats = query({
  args: {
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    type: v.optional(v.string()),
    condition: v.optional(v.string()),
    priceRange: v.optional(v.array(v.number())),
    date: v.optional(v.string()),
    location: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
        km: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("posts");

    if (args.category) {
      q = q.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.type) {
      q = q.filter((q) => q.eq(q.field("tipo"), args.type));
    }

    if (args.condition) {
      const conditions = args.condition.split(",");
      q = q.filter((q) =>
        q.or(...conditions.map((c) => q.eq(q.field("condition"), c)))
      );
    }

    if (args.priceRange) {
      const [min, max] = args.priceRange;
      q = q.filter((q) =>
        q.and(q.gte(q.field("price"), min), q.lte(q.field("price"), max))
      );
    }

    if (args.date) {
      const now = Date.now();
      const days = {
        "Ultimas 24 horas": 1,
        "Ultimos 7 dias": 7,
        "Ultimos 30 dias": 30,
      }[args.date];
      if (days) {
        const limit = now - days * 24 * 60 * 60 * 1000;
        q = q.filter((q) => q.gte(q.field("_creationTime"), limit));
      }
    }

    let posts = await q.collect();

    if (args.title) {
      const fuse = new Fuse(posts, {
        keys: ['title'],
        threshold: 0.4,
        includeScore: true
      });
      posts = fuse.search(args.title).map(result => result.item);
    }

    if (args.location) {
      const { lat, lng, km } = args.location;
      posts = posts.filter(post =>
        post.lat !== undefined &&
        post.lng !== undefined &&
        distanceKm(lat, lng, post.lat, post.lng) <= km
      );
    }

    return {
      totalPosts: posts.length
    };
  }
});

export const getFilteredPrices = query({
  args: {
    title: v.optional(v.string()),
    category: v.optional(v.string()),

  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("posts");

    if (args.category) {
      q = q.filter((q) => q.eq(q.field("category"), args.category));
    }



    let posts = await q.collect();

    if (args.title) {
      const fuse = new Fuse(posts, {
        keys: ['title'],
        threshold: 0.4,
        includeScore: true
      });
      posts = fuse.search(args.title).map(result => result.item);
    }


    const highestPrice = posts.length > 0 ? Math.max(...posts.map(post => post.price)) : 0;

    return { highestPrice };
  }
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
    // const notifications = await ctx.db
    //     .query("notifications")
    //     .withIndex("by_post", (q) => q.eq("postId", args.postId))
    //     .collect();

    // for (const notification of notifications) {
    //     await ctx.db.delete(notification._id);
    // }

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

export const getSoldPostsByUser = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = args.userId ?? (await getAuthenticatedUser(ctx))._id;

    return await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("sold"), true))
      .collect();
  },
});

export const getPostIdById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    

    return {
      post
    };
  },
});

export const getNotSoldPostsByUser = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    return await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .filter((q) => q.eq(q.field("sold"), false))
      .collect();
  },
});

export const markAsSold = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const user = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");
    if (post.userId !== user._id) throw new Error("No autorizado");

    await ctx.db.patch(postId, { sold: true });
  },
});


export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.string(),
    caption: v.string(),
    price: v.number(),
    currency: v.string(),
    location: v.string(),
    lat: v.float64(),
    lng: v.float64(),
    category: v.string(),
    condition: v.string(),
    storageId: v.id("_storage"),
    imageUrls: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Publicación no encontrada");
    if (post.userId !== user._id) throw new Error("No autorizado");

    await ctx.db.patch(args.postId, {
      title: args.title,
      caption: args.caption,
      price: args.price,
      currency: args.currency,
      location: args.location,
      lat: args.lat,
      lng: args.lng,
      category: args.category,
      condition: args.condition,
      storageId: args.storageId, // Primera imagen
      imageUrls: args.imageUrls, // Resto de imágenes
    });
  }
});

