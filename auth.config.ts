import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Refresh the Google access token
 */
async function refreshAccessToken(token: any) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Request Google Ads and Analytics API permissions
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/adwords", // Google Ads API access
            "https://www.googleapis.com/auth/analytics.readonly", // Google Analytics read access
          ].join(" "),
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      // Store Google OAuth tokens on first sign-in
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0;
      }

      // Return token if not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Token expired, refresh it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.email = token.email!;
        session.user.name = token.name;
        session.user.image = token.picture as string;
        // Add Google Ads API tokens to session
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.error = token.error as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
