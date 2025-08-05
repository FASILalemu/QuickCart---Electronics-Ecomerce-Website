import { Inngest } from "inngest";
import connectDb from "./db";
import user from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickCart-next" });

//

export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'

    },
    {
        event: 'clerk/user.created'
    },

    async ({event}) => {
        const { id, first_name, last_name, email_address, image_url } = event.data
        const userData = {
            _id:id,
            email: email_address[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }

        await connectDb()
        await User.create(userData)
    }
)

// Inngest function to update in the database

export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated'
    },
    async ({event}) => {
        const { id, first_name, last_name, email_address, image_url } = event.data
        const userData = {
            _id:id,
            email: email_address[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDb()
        await user.findByIdAndUpdate(id,userData)
    }
)

// Inngest function to delete from the database

export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {event: 'clerk/user.deleted'},
    async (event) => {
        const {id} = event.data
        await connectDb
        await user.findByIdAndDelete(id)
    }
)