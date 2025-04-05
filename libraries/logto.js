import LogtoClient, { UserScope } from "@logto/next";

export const logtoClient = new LogtoClient({
  scopes: [UserScope.Email],
  endpoint: process.env.LOGTO_ENDPOINT,
  appId: process.env.LOGTO_APP_ID,
  appSecret: process.env.LOGTO_APP_SECRET,
  baseUrl: "http://localhost:3000",
  cookieSecret: process.env.LOGTO_COOKIE_SECRET,
  cookieSecure: process.env.NODE_ENV === "production",
});
