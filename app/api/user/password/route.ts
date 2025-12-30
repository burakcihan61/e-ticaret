import { NextResponse } from "next/server"
import { getSession, verifyPassword, hashPassword } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { passwordChangeSchema } from "@/lib/validations"

export async function PATCH(request: Request) {
    try {
        const session = await getSession()

        if (!session) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const body = await request.json()
        const validatedData = passwordChangeSchema.parse(body)

        // Get user with password for verification
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: { password: true },
        })

        if (!user) {
            return new NextResponse("Kullanıcı bulunamadı", { status: 404 })
        }

        // Verify current password
        const isPasswordCorrect = await verifyPassword(validatedData.currentPassword, user.password)

        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Mevcut şifreniz hatalı" }, { status: 400 })
        }

        // Hash new password
        const hashedPassword = await hashPassword(validatedData.newPassword)

        // Update password
        await prisma.user.update({
            where: { id: session.id },
            data: { password: hashedPassword },
        })

        return NextResponse.json({
            message: "Şifreniz başarıyla değiştirildi",
        })
    } catch (error: any) {
        console.error("[USER_PASSWORD_PATCH]", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}
