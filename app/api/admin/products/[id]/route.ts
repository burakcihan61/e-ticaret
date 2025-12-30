import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get single product (Admin version)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: { select: { name: true } },
            },
        })

        if (!product) {
            return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: "İstek başarısız" }, { status: 500 })
    }
}

// Update product
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
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

        // Check if slug or SKU exists for other products
        const existing = await prisma.product.findFirst({
            where: {
                OR: [{ slug }, { sku }],
                NOT: { id },
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

        const product = await prisma.product.update({
            where: { id },
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
        console.error("Product UPDATE error:", error)
        return NextResponse.json({ error: "Ürün güncellenirken bir hata oluştu" }, { status: 500 })
    }
}

// Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        // Check for dependencies (e.g., if product is in orders) before deleting
        // In a real app, you might prefer soft deletion or marking as DISCONTINUED
        // For now, we'll allow deletion if possible

        await prisma.product.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Product DELETE error:", error)
        return NextResponse.json(
            { error: "Ürün silinirken bir hata oluştu. Siparişi olan ürünler silinemez." },
            { status: 500 }
        )
    }
}
