import type { NextRequest } from "next/server";
import { updateSession } from "./supabase/middleware";

export async function middleware(req: NextRequest) {
  const { response, user } = await updateSession(req);
  const referer = req.headers.get("referer");

  if (user && req.nextUrl.pathname === "/" && !referer) {
    return Response.redirect(new URL("/account/dashboard", req.url));
  }

  if (!user && req.nextUrl.pathname.startsWith("/account/dashboard")) {
    return Response.redirect(new URL("/sign-in", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
