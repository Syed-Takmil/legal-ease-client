



import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("LegalEase");
await client.connect();
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),

   emailAndPassword: { 
    enabled: true, 
  }, 
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }, 
    },

     user: {
    additionalFields: {
      role: {
        type: "string",
        required: true, // or false, depending on your needs
        defaultValue: "user",
      },
    },
  },

   accountLinking: {
    enabled: true,
    trustedProviders: ["google"],
  },
}); 

