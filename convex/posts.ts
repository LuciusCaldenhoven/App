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

export const getAllImageUrls = query({
  args: { storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    const urls = await Promise.all(
      args.storageIds.map(async (storageId) => {
        const url = await ctx.storage.getUrl(storageId);
        return url ?? null; // para filtrar nulos en el front
      })
    );
    return urls;
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
    nivel2: v.optional(v.string()),
    nivel3: v.optional(v.string()),
    nivel4: v.optional(v.string()),
    subcategory: v.string(),
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
      nivel2: args.nivel2,
      nivel3: args.nivel3,
      nivel4: args.nivel4,
      subcategory: args.subcategory,
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





export const getFeed = query({
  args: {
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    nivel2: v.optional(v.string()),
    nivel3: v.optional(v.string()),
    nivel4: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { category, subcategory, nivel2, nivel3, nivel4 } = args;

    // 1) Traer productos
    const all = await ctx.db.query("posts").collect();
    const filtered = all.filter(item => {
      if (subcategory) return item.subcategory === subcategory;
      if (category) return item.category === category;
      if (nivel2) return item.nivel2 === nivel2;
      if (nivel3) return item.nivel3 === nivel3;
      if (nivel4) return item.nivel4 === nivel4;
      return false;
    });

    // 4) (Opcional) Fuzzy por título si también llega title
    

    // 5) Recientes (últimos 7 días)
   const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = filtered.filter(p => p._creationTime >= sevenDaysAgo);

    // 3) Elegir 6 recientes al azar
    const recent6 = shuffle(recent).slice(0, 6);

    // 4) Elegir 6 aleatorios del resto
    const idsRecientes = new Set(recent6.map(p => p._id));
    const resto = filtered.filter(p => !idsRecientes.has(p._id));
    const random6 = shuffle(resto).slice(0, 6);

    return { recent: recent6, random: random6 };
  }
});

// Fisher–Yates
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}




export const getFilteredPosts = query({
  args: {
    search: v.optional(v.boolean()),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    nivel2: v.optional(v.string()),
    nivel3: v.optional(v.string()),
    nivel4: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    type: v.optional(v.string()),
    condition: v.optional(v.string()),
    priceRange: v.optional(v.array(v.number())),
    date: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  

  handler: async (ctx, args) => {

    
    const currentUser = await getAuthenticatedUser(ctx);
    const tableQuery = ctx.db.query("posts");

    let indexedQuery = tableQuery;
    if (args.category && !args.search) {
      indexedQuery = indexedQuery.filter((q) => q.eq(q.field("category"), args.category));
    }
    if (args.nivel2 && !args.search) {
      indexedQuery = indexedQuery.filter((q) => q.eq(q.field("nivel2"), args.nivel2));
    }
    if (args.nivel3 && !args.search) {
      indexedQuery = indexedQuery.filter((q) => q.eq(q.field("nivel3"), args.nivel3));
    }
    if (args.nivel4 && !args.search) {
      indexedQuery = indexedQuery.filter((q) => q.eq(q.field("nivel4"), args.nivel4));
    }
    if (args.subcategory && !args.search) {
      indexedQuery = indexedQuery.filter((q) => q.eq(q.field("subcategory"), args.subcategory));
    }
    if (args.type) {
      indexedQuery = indexedQuery.filter((q) => q.eq(q.field("tipo"), args.type));
    }

    if (args.condition) {
      const conditions = args.condition.split(",");
      indexedQuery = indexedQuery.filter((q) =>
        q.or(...conditions.map((c) => q.eq(q.field("condition"), c)))
      );
    }

    if (args.priceRange) {
      const [min, max] = args.priceRange;
      indexedQuery = indexedQuery.filter((q) =>
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
        indexedQuery = indexedQuery.filter((q) => q.gte(q.field("_creationTime"), limit));
      }
    }

    const { page, isDone, continueCursor } = await indexedQuery.paginate({
      ...args.paginationOpts,
      numItems: 1000, 
    });


    // Aplicar búsqueda por título usando Fuse.js si hay un título
    let filteredPage = page;
    if (args.title && args.search) {
      const fuseOptions = {
        keys: ['title', 'subcategory', 'nivel2', 'nivel3', 'nivel4'],
        threshold: 0.20, 
        includeScore: true,
        
      };
      const fuse = new Fuse(filteredPage, fuseOptions);
      const searchResults = fuse.search(args.title);

      filteredPage = searchResults.map(result => result.item);
    }

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
    search: v.boolean(),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    nivel2: v.optional(v.string()),
    nivel3: v.optional(v.string()),
    nivel4: v.optional(v.string()),
    type: v.optional(v.string()),
    condition: v.optional(v.string()),
    priceRange: v.optional(v.array(v.number())),
    date: v.optional(v.string()),

  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("posts");
    
    if (args.category && !args.search) {
      q = q.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.nivel2 && !args.search) {
      q = q.filter((q) => q.eq(q.field("nivel2"), args.nivel2));
    }

    if (args.nivel3 && !args.search) {
      q = q.filter((q) => q.eq(q.field("nivel3"), args.nivel3));
    }

    if (args.nivel4 && !args.search) {
      q = q.filter((q) => q.eq(q.field("nivel4"), args.nivel4));
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

    if (args.title && args.search) {
      const fuse = new Fuse(posts, {
        keys: ['title', 'subcategory', 'nivel2', 'nivel3', 'nivel4'],
        threshold: 0.20,
        includeScore: true,
        
      });
      posts = fuse.search(args.title).map(result => result.item);
    }

    

    return {
      totalPosts: posts.length
    };
  }
});

export const getFilteredPrices = query({
  args: {
    search: v.boolean(),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    nivel2: v.optional(v.string()),
    nivel3: v.optional(v.string()),
    nivel4: v.optional(v.string()),
    type: v.optional(v.string()),
    condition: v.optional(v.string()),
    priceRange: v.optional(v.array(v.number())),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("posts");
  
    if (args.category && !args.search) {
      q = q.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.nivel2 && !args.search) {
      q = q.filter((q) => q.eq(q.field("nivel2"), args.nivel2));
    }

    if (args.nivel3 && !args.search) {
      q = q.filter((q) => q.eq(q.field("nivel3"), args.nivel3));
    }

    if (args.nivel4 && !args.search) {
      q = q.filter((q) => q.eq(q.field("nivel4"), args.nivel4));
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

    if (args.title && args.search) {
      const fuse = new Fuse(posts, {
        keys: ['title', 'subcategory', 'nivel2', 'nivel3', 'nivel4'],
        threshold: 0.20,
        includeScore: true,
        
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


    if (post.storageId) {
      await ctx.storage.delete(post.storageId);
    }
    if (post.imageUrls && Array.isArray(post.imageUrls)) {
      for (const id of post.imageUrls) {
        await ctx.storage.delete(id);
      }
    }

    // delete associated comments
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
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

export const existsPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    return !!post; 
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
    nivel2: v.optional(v.string()),
    nivel3: v.optional(v.string()),
    nivel4: v.optional(v.string()),
    subcategory: v.string(),
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
      nivel2: args.nivel2,
      nivel3: args.nivel3,
      nivel4: args.nivel4,
      subcategory: args.subcategory,
      condition: args.condition,
      storageId: args.storageId, // Primera imagen
      imageUrls: args.imageUrls, // Resto de imágenes
    });
  }
});


export const deleteFromStorage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
  },
});
