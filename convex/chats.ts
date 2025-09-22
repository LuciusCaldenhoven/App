import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";

// Crear un nuevo chat
export const createChat = mutation({
  args: {
    sellerId: v.id("users"),
  },
  handler: async (ctx, { sellerId }) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // Verifica si ya existe un chat entre el comprador y el vendedor
    const existingChat = await ctx.db
      .query("chats")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("buyerId"), currentUser._id),
            q.eq(q.field("sellerId"), sellerId)
          ),
          q.and(
            q.eq(q.field("buyerId"), sellerId),
            q.eq(q.field("sellerId"), currentUser._id)
          )
        )
      )
      .unique();

    if (existingChat) {
      return existingChat._id; // Devuelve el ID del chat existente
    }

    // Crea un nuevo chat si no existe
    const chatId = await ctx.db.insert("chats", {
      buyerId: currentUser._id,
      sellerId,
      lastMessage: undefined,
    });

    await ctx.db.insert("notifications", {
      receiverId: sellerId,
      senderId: currentUser._id,
      type: "message",
      text: `Te ha enviado un mensaje para comenzar una conversación sobre uno de tus productos.`,
    });


    return chatId;
  },
});

// Obtener los chats de un usuario
export const getChats = query({
  handler: async (ctx) => {
    const me = await getAuthenticatedUser(ctx);

    // 1) Trae chats donde soy buyer o seller
    const rows = await ctx.db
      .query("chats")
      .filter((q) =>
        q.or(
          q.eq(q.field("buyerId"), me._id),
          q.eq(q.field("sellerId"), me._id)
        )
      )
      // Nota: sin índice por lastTime, esto ordena por _creationTime desc.
      // Si quieres garantizar orden por lastTime aquí, crea un índice por lastTime y úsalo.
      .order("desc")
      .collect();

    // 2) Enriquecer con buyer/seller + resolver badge para mí
    const chatsWithInfo = await Promise.all(
      rows.map(async (chat) => {
        const [buyer, seller] = await Promise.all([
          ctx.db.get(chat.buyerId),
          ctx.db.get(chat.sellerId),
        ]);

        const isSeller = chat.sellerId === me._id;
        // ✅ Resuelve el badge ya listo para el front
        const badge = isSeller ? (chat.badgeSeller ?? 0) : (chat.badgeBuyer ?? 0);

        return {
          ...chat,
          badge, // <- el front solo usa este
          buyer: {
            _id: buyer?._id ?? null,
            fullname: buyer?.fullname ?? "Usuario desconocido",
            image: buyer?.image ?? null,
            pushToken: buyer?.pushToken ?? null,
          },
          seller: {
            _id: seller?._id ?? null,
            fullname: seller?.fullname ?? "Usuario desconocido",
            image: seller?.image ?? null,
            pushToken: seller?.pushToken ?? null,
          },
        };
      })
    );

    

    return chatsWithInfo;
  },
});

export const resetBadge = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, { chatId }) => {
    const me = await getAuthenticatedUser(ctx);
    const chat = await ctx.db.get(chatId);
    if (!chat) return;

    const sellerId = chat.sellerId;
    const buyerId  = chat.buyerId;

    await ctx.db.patch(chatId, {
      badgeSeller: me._id === sellerId ? 0 : chat.badgeSeller ?? 0,
      badgeBuyer:  me._id === buyerId  ? 0 : chat.badgeBuyer  ?? 0,
    });
  },
});
