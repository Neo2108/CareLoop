import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

function isStaffPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/appointments") ||
    pathname.startsWith("/api/trigger-reminder-calls") ||
    pathname.startsWith("/api/send-sms")
  );
}

function isAuthPath(pathname: string): boolean {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/patient-login") ||
    pathname.startsWith("/patients") ||
    pathname.startsWith("/api/auth")
  );
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (isAuthPath(pathname)) {
    return undefined;
  }

  if (isStaffPath(pathname) && !req.auth) {
    if (pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", code: "UNAUTHORIZED" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  return undefined;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
