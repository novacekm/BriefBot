import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute =
        nextUrl.pathname.startsWith("/upload") ||
        nextUrl.pathname.startsWith("/documents") ||
        nextUrl.pathname.startsWith("/settings");

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      // Redirect logged-in users away from auth pages
      if (
        isLoggedIn &&
        (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
      ) {
        return Response.redirect(new URL("/documents", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Configured in auth.ts (credentials can't run in Edge)
} satisfies NextAuthConfig;
