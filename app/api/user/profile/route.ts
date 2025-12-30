import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { profileUpdateSchema } from "@/lib/validations"

export async function PATCH(request: Request) {
    try {
        const session = await getSession()

        if (!session) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const body = await request.json()
        const validatedData = profileUpdateSchema.parse(body)

        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: {
                name: validatedData.name,
                phone: validatedData.phone,
            },
        })

        return NextResponse.json({
            message: "Profil başarıyla güncellendi",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
            },
        })
    } catch (error: any) {
        console.error("[USER_PROFILE_PATCH]", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}
