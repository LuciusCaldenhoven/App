import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export function usePushRegistration() {
  const savePushToken = useMutation(api.notifications.savePushToken);

  const registerPush = async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      await savePushToken({ pushToken: token });
      console.log("Push token registrado correctamente ✅");

    }
  };

  return { registerPush };
}
