import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("who-s-the-good-dog");

  console.log(token);

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: "/test",
};
