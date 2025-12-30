import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
            },
            include: {
                _count: {
                    select: {
                        products: {
                            where: {
                                status: "PUBLISHED",
                            },
                        },
                    },
                },
            },
            orderBy: {
                order: "asc",
            },
        })

        return NextResponse.json({ categories })
    } catch (error) {
        console.error("Get categories error:", error)
        return NextResponse.json({ error: "Kategoriler alınamadı" }, { status: 500 })
    }
}
