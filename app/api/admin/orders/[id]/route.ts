import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get single order (Admin version)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                items: true,
                shippingAddress: true,
                statusHistory: { orderBy: { createdAt: "desc" } },
            },
        })

        if (!order) {
            return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
        }

        return NextResponse.json(order)
    } catch (error) {
        return NextResponse.json({ error: "İstek başarısız" }, { status: 500 })
    }
}

// Update order status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        const body = await request.json()
        const { status, note } = body

        if (!status) {
            return NextResponse.json({ error: "Durum gerekli" }, { status: 400 })
        }

        const order = await prisma.order.update({
            where: { id },
            data: {
                status,
                statusHistory: {
                    create: {
                        status,
                        note: note || `Sipariş durumu ${status} olarak güncellendi.`,
                    },
                },
            },
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error("Order status update error:", error)
        return NextResponse.json(
            { error: "Sipariş güncellenirken bir hata oluştu" },
            { status: 500 }
        )
    }
}
