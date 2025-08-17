import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routes } from "./lib/routes";

export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwt_token")?.value;
  const { pathname } = request.nextUrl;

  if (
    jwtToken &&
    (pathname === routes.SIGN_IN || pathname === routes.SIGN_UP)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!jwtToken && pathname !== routes.SIGN_IN) {
    return NextResponse.redirect(new URL(routes.SIGN_IN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
