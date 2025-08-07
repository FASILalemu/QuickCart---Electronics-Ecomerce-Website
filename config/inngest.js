import { Inngest } from "inngest";
import connectDb from "./db";
import User from "@/models/user"; // Consistent uppercase for model

export const inngest = new Inngest({ id: "quickCart-next" });

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`.trim(),
        imageUrl: image_url
      };

      await connectDb();
      await User.create(userData);
    } catch (error) {
      console.error("User creation sync failed:", error);
      throw error;
    }
  }
);

export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`.trim(),
        imageUrl: image_url
      };

      await connectDb();
      await User.findByIdAndUpdate(id, userData, { new: true });
    } catch (error) {
      console.error("User update sync failed:", error);
      throw error;
    }
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      const { id } = event.data;
      await connectDb();
      await User.findByIdAndDelete(id);
    } catch (error) {
      console.error("User deletion sync failed:", error);
      throw error;
    }
  }
);