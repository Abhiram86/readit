import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "your-secret-key"
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const authPages = ["/signin", "/signup"]; // Pages that should be inaccessible when logged in
  const protectedRoutes = ["/newproblem"]; // Pages that require authentication

  // If there's no token (user is logged out)
  if (!token) {
    // Allow access to /signin and /signup when logged out
    if (authPages.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    // Redirect to /signin if trying to access a protected page
    if (protectedRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  // If there's a token, verify it
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // If token is expired, redirect to signin and remove token
    if (payload.exp && payload.exp < Date.now() / 1000) {
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("token");
      return response;
    }

    // If user is authenticated and tries to access /signin or /signup, redirect to home
    if (authPages.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Token verification failed:", err);
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/newproblem", "/signin", "/signup"], // Match protected and auth pages
};
