import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";

// Enviar un mensaje
export const sendMessage = mutation({
  args: {
    content: v.string(),
    chatId: v.id("chats"),
    file: v.optional(v.id("_storage")),
    product: v.optional(v.id("posts")),
  },
  handler: async (ctx, { content, chatId, file, product }) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const messageId = await ctx.db.insert("messages", {
      chatId,
      senderId: currentUser._id,
      content,
      file,
      product,
      createdAt: Date.now(),
    });

    // preview de último mensaje
    let lastMessage = "";
    if (content) lastMessage = file ? `📷 ${content}` : content;
    else if (file) lastMessage = "📷 Foto";
    else if (product) lastMessage = "🏷️ Producto";
    else lastMessage = "Mensaje";

    const chat = await ctx.db.get(chatId);
    if (!chat) throw new Error("Chat no encontrado");

    const sellerId = chat.sellerId;
    const buyerId  = chat.buyerId;
    const senderId = currentUser._id;

    let patch: any = {
      lastMessage,
      lastTime: Date.now(),
    };

    // 🔔 prende el badge del destinatario y apaga el del emisor
    if (senderId === sellerId) {
      patch.badgeSeller = 0;
      patch.badgeBuyer  = 1;
    } else {
      patch.badgeSeller = 1;
      patch.badgeBuyer  = 0;
    }

    await ctx.db.patch(chatId, patch);
    return messageId;
  },
});


export const getMessages = query({
  args: { chatId: v.id('chats') },
  handler: async ({ db, storage }, { chatId }) => {
    // Obtiene los mensajes del chat
    const messages = await db
      .query('messages')
      .withIndex('by_chat', (q) => q.eq('chatId', chatId))
      .order('asc')
      .collect();

    // Si el mensaje tiene un archivo, obtiene la URL del almacenamiento
    return Promise.all(
      messages.map(async (message) => {
        if (message.file) {
          const url = await storage.getUrl(message.file);
          if (url) {
            return { ...message, file: url };
          }
        }
        return message;
      })
    );
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});