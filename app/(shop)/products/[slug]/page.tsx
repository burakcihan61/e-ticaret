import { notFound } from "next/navigation"
import { Metadata, ResolvingMetadata } from "next"
import prisma from "@/lib/prisma"
import ProductDetailClient from "@/components/product/product-detail-client"

interface ProductDetailPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata(
    { params }: ProductDetailPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params
    const product = await prisma.product.findUnique({
        where: { slug },
        select: {
            name: true,
            description: true,
            images: true,
            metaTitle: true,
            metaDescription: true,
        },
    })

    if (!product) {
        return {
            title: "Ürün Bulunamadı",
        }
    }

    const previousImages = (await parent).openGraph?.images || []

    return {
        title: product.metaTitle || product.name,
        description: product.metaDescription || product.description,
        openGraph: {
            images: [...product.images, ...previousImages],
        },
    }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = await params

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            brand: true,
            variants: true,
            attributes: true,
            reviews: {
                include: {
                    user: {
                        select: {
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
        notFound()
    }

    // Serialize product data (Prisma Decimal to Number)
    const serializedProduct = {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        weight: product.weight ? Number(product.weight) : null,
        width: product.width ? Number(product.width) : null,
        height: product.height ? Number(product.height) : null,
        length: product.length ? Number(product.length) : null,
        taxRate: Number(product.taxRate),
        reviews: product.reviews.map((review: any) => ({
            ...review,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt.toISOString(),
        })),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }

    return <ProductDetailClient product={serializedProduct} />
}
