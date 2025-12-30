import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
        }

        const body = await request.json()
        const { code, cartTotal } = body

        if (!code) {
            return NextResponse.json({ error: "Kupon kodu gerekli" }, { status: 400 })
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        })

        if (!coupon || !coupon.isActive) {
            return NextResponse.json(
                { error: "Geçersiz veya süresi dolmuş kupon" },
                { status: 400 }
            )
        }

        // Check expiration
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return NextResponse.json({ error: "Kupon süresi dolmuş" }, { status: 400 })
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return NextResponse.json({ error: "Kupon kullanım limiti dolmuş" }, { status: 400 })
        }

        // Check min order amount
        if (coupon.minOrderAmount && cartTotal < Number(coupon.minOrderAmount)) {
            return NextResponse.json(
                {
                    error: `Bu kupon için minimum sepet tutarı ${coupon.minOrderAmount} TL olmalıdır`,
                },
                { status: 400 }
            )
        }

        // Calculate discount
        let discountAmount = 0
        if (coupon.type === "PERCENTAGE") {
            discountAmount = (cartTotal * Number(coupon.value)) / 100
            if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
                discountAmount = Number(coupon.maxDiscount)
            }
        } else if (coupon.type === "FIXED_AMOUNT") {
            discountAmount = Number(coupon.value)
        } else if (coupon.type === "FREE_SHIPPING") {
            // Handled separately usually, or return distinct type
        }

        // Ensure discount doesn't exceed total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal
        }

        return NextResponse.json({
            valid: true,
            code: coupon.code,
            discountAmount,
            type: coupon.type,
        })
    } catch (error) {
        console.error("[COUPON_VALIDATE]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}
