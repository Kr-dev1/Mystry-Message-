import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.includes("/sign-up") ||
      url.pathname.includes("/veriify") ||
      url.pathname.includes("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/signup", "/", "/verify/:path*", "/dashboard/:path*"],
};