import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path: '/clerk-users-webhook',
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        console.log("=== Clerk Webhook: Request received ==="); 

        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("CLERK_WEBHOOK_SECRET is missing");
            return new Response("Missing CLERK_WEBHOOK_SECRET environment variable", { status: 500 });
        }

        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        if (!svix_id || !svix_signature || !svix_timestamp) {
            console.error("Missing Svix headers", { svix_id, svix_signature, svix_timestamp });
            return new Response("Error occurred -- no svix headers", { status: 400 });
        }

        const payload = await request.json();
        console.log("Webhook Raw Payload:", JSON.stringify(payload));

        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret);
        let evt: any;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as any;
            console.log("Webhook verified successfully!", evt);
        } catch (err) {
            console.error("Error verifying webhook:", err);
            return new Response("Error occurred", { status: 400 });
        }

        const eventType = evt.type;
        console.log("Received Clerk Event Type:", eventType);

        if (eventType === "user.created") {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;

            const email = email_addresses[0]?.email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            console.log("Creating user in Convex with data:", {
                email,
                fullname: name,
                image: image_url,
                clerkId: id,
                username: email?.split("@")[0],
            });

            try {
                await ctx.runMutation(api.users.createUser, {
                    email,
                    fullname: name,
                    image: image_url,
                    clerkId: id,
                    username: email?.split("@")[0],
                });
                console.log("User created in Convex successfully!");
            } catch (error) {
                console.error("Error creating user in Convex:", error);
                return new Response("Error creating user", { status: 500 });
            }
        }

        return new Response("Webhook processed successfully", { status: 200 });
    }),
});

export default http;
