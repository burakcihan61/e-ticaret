import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth"
import { loginSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validatedData = loginSchema.parse(body)

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (!user) {
            return NextResponse.json({ error: "Email veya şifre hatalı" }, { status: 401 })
        }

        // Check if user is active
        if (user.status !== "ACTIVE") {
            return NextResponse.json({ error: "Hesabınız askıya alınmış" }, { status: 403 })
        }

        // Verify password
        const isValidPassword = await verifyPassword(validatedData.password, user.password)

        if (!isValidPassword) {
            return NextResponse.json({ error: "Email veya şifre hatalı" }, { status: 401 })
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        })

        // Create JWT token
        const token = await createToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Set cookie
        await setAuthCookie(token)

        return NextResponse.json({
            message: "Giriş başarılı",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        })
    } catch (error: any) {
        console.error("Login error:", error)

        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Geçersiz veri", details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json({ error: "Giriş sırasında bir hata oluştu" }, { status: 500 })
    }
}
