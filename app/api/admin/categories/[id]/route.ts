import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get single category (Admin version)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                parent: { select: { name: true } },
            },
        })

        if (!category) {
            return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 })
        }

        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: "İstek başarısız" }, { status: 500 })
    }
}

// Update category
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        const body = await request.json()
        const { name, slug, description, parentId, image } = body

        // Check if slug exists for other categories
        const existing = await prisma.category.findFirst({
            where: {
                slug,
                NOT: { id },
            },
        })

        if (existing) {
            return NextResponse.json({ error: "Bu slug zaten kullanımda" }, { status: 400 })
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                parentId: parentId || null,
                image: image || null,
            },
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error("Category UPDATE error:", error)
        return NextResponse.json(
            { error: "Kategori güncellenirken bir hata oluştu" },
            { status: 500 }
        )
    }
}

// Delete category
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

        // Check for dependencies (products or subcategories)
        const productsCount = await prisma.product.count({
            where: { categoryId: id },
        })

        if (productsCount > 0) {
            return NextResponse.json(
                {
                    error: "Bu kategoriye ait ürünler var. Lütfen önce ürünleri başka bir kategoriye taşıyın.",
                },
                { status: 400 }
            )
        }

        const childrenCount = await prisma.category.count({
            where: { parentId: id },
        })

        if (childrenCount > 0) {
            return NextResponse.json(
                {
                    error: "Bu kategorinin alt kategorileri var. Lütfen önce onları silin veya başka bir yere taşıyın.",
                },
                { status: 400 }
            )
        }

        await prisma.category.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Category DELETE error:", error)
        return NextResponse.json({ error: "Kategori silinirken bir hata oluştu" }, { status: 500 })
    }
}
