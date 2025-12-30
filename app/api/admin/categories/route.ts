import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get all categories (Admin version)
export async function GET() {
    try {
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        const categories = await prisma.category.findMany({
            include: {
                parent: { select: { name: true } },
                _count: { select: { products: true, children: true } },
            },
            orderBy: { name: "asc" },
        })

        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: "İstek başarısız" }, { status: 500 })
    }
}

// Create new category
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 })
        }

        const body = await request.json()
        const { name, slug, description, parentId, image } = body

        // Check if slug exists
        const existing = await prisma.category.findUnique({
            where: { slug },
        })

        if (existing) {
            return NextResponse.json({ error: "Bu slug zaten kullanımda" }, { status: 400 })
        }

        const category = await prisma.category.create({
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
        console.error("Category CREATE error:", error)
        return NextResponse.json(
            { error: "Kategori oluşturulurken bir hata oluştu" },
            { status: 500 }
        )
    }
}
