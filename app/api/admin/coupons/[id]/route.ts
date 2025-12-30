import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const { id } = await params

        await prisma.coupon.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Kupon silindi" })
    } catch (error) {
        console.error("[COUPON_DELETE]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}
