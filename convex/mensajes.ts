import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";

// Enviar un mensaje
export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    file: v.optional(v.string()),
  },
  handler: async (ctx, { chatId, content, file }) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // Inserta el mensaje en la base de datos
    const messageId = await ctx.db.insert("messages", {
      chatId,
      senderId: currentUser._id,
      content,
      file: file || undefined,
      createdAt: Date.now(),
    });

    // Actualiza el último mensaje en el chat
    await ctx.db.patch(chatId, {
      lastMessage: content,
    });

    return messageId;
  },
});

// Obtener mensajes de un chat
export const getMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, { chatId }) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // Verifica si el usuario tiene acceso al chat
    const chat = await ctx.db.get(chatId);
    if (!chat || (chat.buyerId !== currentUser._id && chat.sellerId !== currentUser._id)) {
      throw new Error("No tienes acceso a este chat.");
    }

    // Obtiene los mensajes del chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .order("asc")
      .collect();

    return messages;
  },
});