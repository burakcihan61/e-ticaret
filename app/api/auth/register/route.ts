import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"
import { registerSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validatedData = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Bu email adresi zaten kullanılıyor" },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                role: "USER",
                status: "ACTIVE",
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        })

        // Create JWT token
        const token = await createToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Set cookie
        await setAuthCookie(token)

        return NextResponse.json(
            {
                message: "Kayıt başarılı",
                user,
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Register error:", error)

        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Geçersiz veri", details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu" }, { status: 500 })
    }
}
