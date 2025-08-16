import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routes } from "./lib/routes";

export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwt_token");
  const { pathname } = request.nextUrl;

  if (
    jwtToken &&
    (pathname === routes.SIGN_IN || pathname === routes.SIGN_UP)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [routes.SIGN_IN, routes.SIGN_UP],
};
