import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params

        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                    },
                },
                variants: true,
                attributes: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    where: {
                        isApproved: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        })

        if (!product) {
            return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 })
        }

        // Calculate average rating
        const avgRating =
            product.reviews.length > 0
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                : 0

        // Increment view count
        await prisma.product.update({
            where: { id: product.id },
            data: { viewCount: { increment: 1 } },
        })

        return NextResponse.json({
            ...product,
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: product.reviews.length,
        })
    } catch (error) {
        console.error("Get product error:", error)
        return NextResponse.json({ error: "Ürün bilgisi alınamadı" }, { status: 500 })
    }
}
