import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getNotifications = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const notifications = await ctx.db.query("notifications")
      .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
      .order("desc")
      .collect();

    const notificationsWithInfo = await Promise.all(
      notifications.map(async (notification) => {
        let senderInfo = null;

        if (notification.senderId) {
          const sender = await ctx.db.get(notification.senderId);
          if (sender) {
            senderInfo = {
              _id: sender._id,
              fullname: sender.fullname,
              image: sender.image,
            };
          }
        }

        return {
          ...notification,
          sender: senderInfo,
        };
      })
    );

    return notificationsWithInfo;
  },
});

export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {  
    await ctx.db.delete(args.notificationId);
  },
});

export const savePushToken = mutation({
  args: {
    pushToken: v.string(),
  },
  handler: async (ctx, { pushToken }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("No user authenticated");

    // Aquí guardás el token en la tabla users, por ejemplo
    await ctx.db.patch(user._id, { pushToken });
  },
});
