import { useRouter } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";

export function useChatNavigation() {
    const router = useRouter();
    const existingChats = useQuery(api.chats.getChats);
    const createChat = useMutation(api.chats.createChat);
    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

    const goToChat = async ({ postUserId, postId, text }: { postUserId: Id<"users">, postId: Id<"posts">, text? :string }) => {
        try {
            const existingChat = existingChats?.find(
                (chat: any) =>
                    (currentUser?._id === chat.buyerId && postUserId === chat.sellerId) ||
                    (currentUser?._id === chat.sellerId && postUserId === chat.buyerId)
            );

            if (existingChat) {
                router.push({
                    pathname: "/chat/[chatid]",
                    params: {
                        chatid: existingChat._id,
                        Prod: postId,
                        text: text || "",
                    },
                });
            } else {
                const newChatId = await createChat({
                    sellerId: postUserId,
                });

                router.push({
                    pathname: "/chat/[chatid]",
                    params: {
                        chatid: newChatId,
                        Prod: postId,
                        text: text || "",
                    },
                });
            }
        } catch (error) {
            console.error("Error al navegar al chat:", error);
        }
    };

    return { goToChat, currentUser, existingChats };
}
