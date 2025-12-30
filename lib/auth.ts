import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from "jose"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import prisma from "./prisma"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this")

const COOKIE_NAME = "auth-token"

export interface JWTPayload extends JoseJWTPayload {
    userId: string
    email: string
    role: string
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

// JWT Token functions
export async function createToken(payload: JWTPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const verified = await jwtVerify(token, JWT_SECRET)
        return verified.payload as JWTPayload
    } catch (error) {
        return null
    }
}

// Session management
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    })
}

export async function removeAuthCookie() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)
    return token?.value || null
}

export async function getAuthTokenFromRequest(request: NextRequest): Promise<string | null> {
    return request.cookies.get(COOKIE_NAME)?.value || null
}

// Get current user session
export async function getSession() {
    try {
        const token = await getAuthToken()
        if (!token) return null

        const payload = await verifyToken(token)
        if (!payload) return null

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                image: true,
            },
        })

        if (!user || user.status !== "ACTIVE") return null

        return user
    } catch (error) {
        return null
    }
}

export async function getSessionFromRequest(request: NextRequest) {
    try {
        const token = await getAuthTokenFromRequest(request)
        if (!token) return null

        const payload = await verifyToken(token)
        if (!payload) return null

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                image: true,
            },
        })

        if (!user || user.status !== "ACTIVE") return null

        return user
    } catch (error) {
        return null
    }
}

// Check if user is admin
export async function requireAdmin() {
    const session = await getSession()
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
        throw new Error("Unauthorized: Admin access required")
    }
    return session
}
