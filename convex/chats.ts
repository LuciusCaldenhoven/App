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
    const currentUser = await getAuthenticatedUser(ctx);

    // Busca chats donde el usuario sea comprador o vendedor
    const chats = await ctx.db
      .query("chats")
      .filter((q) =>
        q.or(
          q.eq(q.field("buyerId"), currentUser._id),
          q.eq(q.field("sellerId"), currentUser._id)
        )
      )
      .order("desc")
      .collect();

    // Agrega información adicional sobre el comprador, vendedor y producto
    const chatsWithInfo = await Promise.all(
      chats.map(async (chat) => {
        const buyer = await ctx.db.get(chat.buyerId);
        const seller = await ctx.db.get(chat.sellerId);

        return {
          ...chat,
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
          }
        };
      })
    );

    return chatsWithInfo;
  },
});