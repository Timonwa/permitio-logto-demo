import { useState, useEffect } from "react";

export function usePermissions(userId) {
  const [permissions, setPermissions] = useState({
    "view:Reports": false,
    "edit:Reports": false,
    "delete:Reports": false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkPermission = async url => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`Permission check failed: ${response.status}`);
          return { allowed: false };
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.warn("Invalid response format");
          return { allowed: false };
        }
        return response.json();
      } catch (err) {
        console.error("Permission check error:", err);
        return { allowed: false };
      }
    };

    // Function to check all permissions we need
    const checkPermissions = async () => {
      try {
        setError(null);
        const results = await Promise.all([
          checkPermission(
            `/api/check-permission?userId=${userId}&action=view&resource=Reports`
          ),
          checkPermission(
            `/api/check-permission?userId=${userId}&action=edit&resource=Reports`
          ),
          checkPermission(
            `/api/check-permission?userId=${userId}&action=delete&resource=Reports`
          ),
        ]);

        setPermissions({
          "view:Reports": results[0].isPermitted,
          "edit:Reports": results[1].isPermitted,
          "delete:Reports": results[2].isPermitted,
        });
      } catch (error) {
        console.error("Error checking permissions:", error);
        setError(error.message);
        setPermissions({
          "view:Reports": false,
          "edit:Reports": false,
          "delete:Reports": false,
        });
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [userId]);

  // Helper function to easily check permissions
  const can = (action, resource) => {
    return permissions[`${action}:${resource}`] || false;
  };

  return { permissions, loading, error, can };
}
