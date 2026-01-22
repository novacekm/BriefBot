import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Skip static files, API routes, etc.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
