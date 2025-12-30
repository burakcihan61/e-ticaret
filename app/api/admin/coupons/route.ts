import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(coupons)
    } catch (error) {
        console.error("[COUPONS_GET]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const body = await request.json()
        const { code, type, value, minOrderAmount, usageLimit, expiresAt } = body

        if (!code || !type || !value) {
            return new NextResponse("Gerekli alanlar eksik", { status: 400 })
        }

        const existingCoupon = await prisma.coupon.findUnique({
            where: { code },
        })

        if (existingCoupon) {
            return new NextResponse("Bu kupon kodu zaten mevcut", { status: 400 })
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                type,
                value: parseFloat(value),
                minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        })

        return NextResponse.json(coupon)
    } catch (error) {
        console.error("[COUPONS_POST]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}
