import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth?.userId;
      console.log("[Auth] ClerkID:", clerkId);

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      // if user is missing in our DB, fetch from Clerk and create on the fly
      if (!user) {
        try {
          const clerkUser = await clerkClient.users.getUser(clerkId);

          user = await User.create({
            clerkId,
            email: clerkUser.emailAddresses?.[0]?.emailAddress,
            name:
              `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
              clerkUser.username ||
              "Unnamed User",
            profileImage: clerkUser.imageUrl || "",
          });

          // sync to stream
          await upsertStreamUser({
            id: user.clerkId,
            name: user.name,
            image: user.profileImage,
          });
        } catch (createErr) {
          console.error("Error syncing Clerk user to DB:", createErr);
          return res.status(404).json({ message: "User not found" });
        }
      }

      // attach user to req for downstream handlers
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
