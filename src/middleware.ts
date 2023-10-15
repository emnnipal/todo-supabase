import { NextRequest, NextResponse } from "next/server";
import { JWTVerifyResult, jwtVerify } from "jose";
import { serverEnv } from "./constants/env";

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;

  const protectedPaths = ["/"];
  const isPathProtected = protectedPaths?.some((path) => pathname == path);

  if (isPathProtected || accessToken) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    let decoded: JWTVerifyResult;
    try {
      decoded = await jwtVerify(
        accessToken,
        new TextEncoder().encode(serverEnv.SUPABASE_JWT_SECRET)
      );
    } catch (error) {
      console.log("jwt error", error);
      const redirectResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );
      redirectResponse.cookies.delete("accessToken");

      return redirectResponse;
    }

    if (request.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
};
