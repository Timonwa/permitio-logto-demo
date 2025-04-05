import { checkPermission } from "../../libraries/permit";

export default async function handler(req, res) {
  const { userId, action, resource } = req.query;

  if (!userId || !action || !resource) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const isPermitted = await checkPermission(userId, action, resource);
    return res.status(200).json({ isPermitted });
  } catch (error) {
    console.error("Error checking permission:", error);
    return res.status(500).json({ error: "Failed to check permission" });
  }
}
