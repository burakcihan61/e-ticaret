import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public routes that don't require authentication
const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/products",
    "/categories",
    "/api/auth/login",
    "/api/auth/register",
    "/api/products",
    "/api/categories",
    "/maintenance",
]

// Admin routes that require admin role
const adminRoutes = ["/admin"]

// Protected routes that require authentication
const protectedRoutes = ["/account", "/checkout", "/cart"]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-pathname", pathname)

    // Check if route is public
    const isPublicRoute =
        publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/")) ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/_next") ||
        pathname.includes(".")

    if (isPublicRoute) {
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }

    // Get auth token from cookie
    const token = request.cookies.get("auth-token")?.value

    // Check if route requires admin
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
    if (isAdminRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }

    // Check if route requires authentication
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
