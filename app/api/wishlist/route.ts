import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get wishlist items
export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ items: [] })
        }

        const wishlist = await prisma.wishlist.findUnique({
            where: { userId: session.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                images: true,
                                stock: true,
                            },
                        },
                    },
                },
            },
        })

        if (!wishlist) {
            return NextResponse.json({ items: [] })
        }

        const formattedItems = wishlist.items.map((item) => ({
            id: item.id,
            productId: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.product.price),
            image: item.product.images[0],
            stock: Number(item.product.stock),
        }))

        return NextResponse.json({ items: formattedItems })
    } catch (error) {
        console.error("Wishlist GET error:", error)
        return NextResponse.json({ error: "İstek başarısız" }, { status: 500 })
    }
}

// Toggle wishlist item
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
        }

        const { productId } = await request.json()
        if (!productId) {
            return NextResponse.json({ error: "Ürün ID gerekli" }, { status: 400 })
        }

        // Find or create wishlist
        let wishlist = await prisma.wishlist.findUnique({
            where: { userId: session.id },
        })

        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId: session.id },
            })
        }

        // Check if item exists
        const existingItem = await prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId: productId,
                },
            },
        })

        if (existingItem) {
            // Remove
            await prisma.wishlistItem.delete({
                where: { id: existingItem.id },
            })
            return NextResponse.json({ action: "removed" })
        } else {
            // Add
            await prisma.wishlistItem.create({
                data: {
                    wishlistId: wishlist.id,
                    productId: productId,
                },
            })
            return NextResponse.json({ action: "added" })
        }
    } catch (error) {
        console.error("Wishlist POST error:", error)
        return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 })
    }
}
