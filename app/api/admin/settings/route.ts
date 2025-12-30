import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const settings = await prisma.settings.findMany()

        // Convert array to object for easier use
        const settingsObject = settings.reduce((acc: Record<string, string>, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {})

        return NextResponse.json(settingsObject)
    } catch (error) {
        console.error("[SETTINGS_GET]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const body = await request.json()
        const { key, value } = body

        if (!key) {
            return new NextResponse("Key gereklidir", { status: 400 })
        }

        await prisma.settings.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) },
        })

        return NextResponse.json({ message: "Ayar güncellendi" })
    } catch (error) {
        console.error("[SETTINGS_PATCH]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}
