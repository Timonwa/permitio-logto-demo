const { Permit } = require("permitio");

// Initialize the Permit.io client
const permit = new Permit({
  pdp: "https://cloudpdp.api.permit.io",
  token: process.env.PERMIT_API_KEY,
});

// Sync a user with Permit.io
export const syncUserToPermit = async (
  userId,
  email,
  firstName,
  lastName,
  role
) => {
  // First, sync the user
  await permit.api.syncUser({
    key: userId,
    email: email || undefined,
    first_name: firstName || undefined,
    last_name: lastName || undefined,
  });

  // Then assign a role to the user (in the default tenant)
  if (role) {
    await permit.api.assignRole({
      user: userId,
      role: role,
      tenant: "default",
    });
  }

  return true;
};

// Check if a user has permission to perform an action on a resource
export const checkPermission = async (userId, action, resource) => {
  return await permit.check(userId, action, resource);
};
