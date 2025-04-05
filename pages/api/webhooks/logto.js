import { syncUserToPermit } from "../../../libraries/permit";

export default async function handler(req, res) {
  const { event, user } = req.body;

  if (event === "PostRegister") {
    try {
      let role = "viewer"; // Default role
      if (user.primaryEmail) {
        if (user.primaryEmail.includes("admin")) {
          role = "admin";
        } else if (user.primaryEmail.includes("editor")) {
          role = "editor";
        }
      }

      // Sync user with Permit.io
      await syncUserToPermit(
        user.id,
        user.primaryEmail,
        user.name,
        undefined,
        role
      );

      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error("Error syncing user:", error);
      return res.status(500).json({ error: "Failed to sync user" });
    }
  }

  return res.status(200).json({ message: "Event ignored" });
}
