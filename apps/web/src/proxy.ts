import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  const requestLocale = request.nextUrl.pathname.split("/")[1];
  const location = response.headers.get("location");
  const redirectLocale = location
    ? new URL(location, request.url).pathname.split("/")[1]
    : undefined;

  if (
    response.status !== 307 ||
    routing.locales.includes(requestLocale as (typeof routing.locales)[number]) ||
    !routing.locales.includes(redirectLocale as (typeof routing.locales)[number])
  ) {
    return response;
  }

  const headers = new Headers(response.headers);
  const vary = headers.get("vary");

  if (!vary?.split(",").some((value) => value.trim().toLowerCase() === "accept-language")) {
    headers.set("Vary", vary ? `${vary}, Accept-Language` : "Accept-Language");
  }

  return new NextResponse(response.body, { status: 308, headers });
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
