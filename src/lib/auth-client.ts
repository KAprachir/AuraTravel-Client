import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
          defaultValue: "traveler"
        },
        isOnboarded: {
          type: "boolean",
          required: false,
          defaultValue: false
        },
        travelStyle: {
          type: "string",
          required: false
        },
        homeLocation: {
          type: "string",
          required: false
        },
        bio: {
          type: "string",
          required: false
        },
        yearsOfExperience: {
          type: "number",
          required: false
        },
        portfolioUrl: {
          type: "string",
          required: false
        }
      }
    })
  ]
});
