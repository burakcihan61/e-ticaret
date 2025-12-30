import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get all products (Admin version)
export async function GET() {
    try {
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        const products = await prisma.product.findMany({
            include: {
                category: { select: { name: true } },
                _count: { select: { orderItems: true } },
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({ error: "İstek başarısız" }, { status: 500 })
    }
}

// Create new product
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        const body = await request.json()
        const {
            name,
            slug,
            description,
            sku,
            price,
            comparePrice,
            stock,
            status,
            categoryId,
            images,
        } = body

        // Check if slug or SKU exists
        const existing = await prisma.product.findFirst({
            where: {
                OR: [{ slug }, { sku }],
            },
        })

        if (existing) {
            return NextResponse.json(
                {
                    error:
                        existing.slug === slug
                            ? "Bu slug zaten kullanımda"
                            : "Bu SKU zaten kullanımda",
                },
                { status: 400 }
            )
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                sku,
                price,
                comparePrice: comparePrice || null,
                stock,
                status,
                categoryId,
                images,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("Product CREATE error:", error)
        return NextResponse.json({ error: "Ürün oluşturulurken bir hata oluştu" }, { status: 500 })
    }
}
