import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routes } from "./lib/routes";

const PUBLIC_ROUTES = [routes.SIGN_IN, routes.SIGN_UP];
const PROTECTED_ROUTES = ["/workspaces"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwtToken = request.cookies.get("jwt_token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (jwtToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!jwtToken && isProtectedRoute) {
    const redirectUrl = new URL(routes.SIGN_IN, request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$|api/).*)",
  ],
};
