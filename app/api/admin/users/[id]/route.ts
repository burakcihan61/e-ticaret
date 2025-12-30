import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession()

        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { role, status } = body

        // Prevent self-demotion or self-suspension for safety
        if (id === session.id) {
            return new NextResponse("Kendi hesabınızın rolünü veya durumunu değiştiremezsiniz", {
                status: 400,
            })
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...(role && { role }),
                ...(status && { status }),
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("[USER_PATCH]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}
