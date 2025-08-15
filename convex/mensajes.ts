import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";

// Enviar un mensaje
export const sendMessage = mutation({
  args: {
    content: v.string(),
    chatId: v.id('chats'),
    file: v.optional(v.id("_storage")),  
    product: v.optional(v.id('posts')),  
  },
  handler: async (ctx, { content, chatId, file, product }) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // Inserta el mensaje en la tabla `messages`
    const messageId = await ctx.db.insert('messages', {
      chatId,
      senderId: currentUser._id,
      content,
      file,
      createdAt: Date.now(),
      product,
    });

    /// dentro de tu mutation después de guardar el mensaje:
    let lastMessage = '';

    if (content) {
      // había texto
      lastMessage = file ? `📷 ${content}` : content;
    } else if (file) {
      // sin texto pero con imagen
      lastMessage = '📷 Foto';
    } else if (product) {
      // sin texto ni imagen pero con producto adjunto
      lastMessage = '🏷️ Producto';
    } else {
      // fallback
      lastMessage = 'Mensaje';
    }

    await ctx.db.patch(chatId, {
      lastMessage,
      lastTime: Date.now(),
    });


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