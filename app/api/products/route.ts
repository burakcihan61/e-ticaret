import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "12")
        const search = searchParams.get("search") || ""
        const categoryId = searchParams.get("categoryId") || ""
        const brandId = searchParams.get("brandId") || ""
        const sortBy = searchParams.get("sortBy") || "createdAt"
        const sortOrder = searchParams.get("sortOrder") || "desc"
        const minPrice = parseFloat(searchParams.get("minPrice") || "0")
        const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999")

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            status: "PUBLISHED",
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ]
        }

        if (categoryId) {
            where.categoryId = categoryId
        }

        if (brandId) {
            where.brandId = brandId
        }

        if (minPrice > 0 || maxPrice < 999999) {
            where.price = {
                gte: minPrice,
                lte: maxPrice,
            }
        }

        // Get products with pagination
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
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
                        },
                    },
                    reviews: {
                        select: {
                            rating: true,
                        },
                    },
                },
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ])

        // Calculate average rating for each product
        const productsWithRating = products.map((product) => {
            const avgRating =
                product.reviews.length > 0
                    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                    : 0

            return {
                ...product,
                averageRating: Math.round(avgRating * 10) / 10,
                reviewCount: product.reviews.length,
                reviews: undefined, // Remove reviews array from response
            }
        })

        return NextResponse.json({
            products: productsWithRating,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Get products error:", error)
        return NextResponse.json({ error: "Ürünler alınamadı" }, { status: 500 })
    }
}
