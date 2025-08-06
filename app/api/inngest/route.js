import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";
// import { helloWorld } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // helloWorld, // <-- This is where you'll always add all your functions

    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],
});