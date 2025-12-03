// TEMPORARILY DISABLED FOR UI/UX DEVELOPMENT
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple pass-through middleware while OAuth is disabled
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

// ===== OAUTH AUTHENTICATION (CURRENTLY DISABLED) =====
// Uncomment below to re-enable authentication:
//
// import { auth } from "@/auth";
//
// export default auth((req) => {
//   const isLoggedIn = !!req.auth;
//   const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
//
//   if (isOnDashboard && !isLoggedIn) {
//     return Response.redirect(new URL("/", req.nextUrl));
//   }
//
//   return undefined;
// });
//
// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
