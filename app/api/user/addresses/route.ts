import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getSession()

        if (!session) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const addresses = await prisma.address.findMany({
            where: {
                userId: session.id,
                isDeleted: false,
            },
            orderBy: { isDefault: "desc" },
        })

        return NextResponse.json(addresses)
    } catch (error) {
        console.error("[USER_ADDRESSES_GET]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const body = await request.json()
        const { title, firstName, lastName, phone, address, city, district, postalCode, country } =
            body

        if (!title || !firstName || !lastName || !phone || !address || !city || !district) {
            return new NextResponse("Tüm alanları doldurun", { status: 400 })
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: session.id,
                title,
                firstName,
                lastName,
                phone,
                address,
                city,
                district,
                postalCode,
                country: country || "Türkiye",
                isDefault: false,
            },
        })

        return NextResponse.json(newAddress)
    } catch (error) {
        console.error("[USER_ADDRESSES_POST]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}
