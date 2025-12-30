import { notFound } from "next/navigation"
import { Metadata, ResolvingMetadata } from "next"
import prisma from "@/lib/prisma"
import ProductCard from "@/components/product/product-card"
import { Badge } from "@/components/ui/badge"

interface CategoryDetailPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata(
    { params }: CategoryDetailPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params
    const category = await prisma.category.findUnique({
        where: { slug },
        select: {
            name: true,
            description: true,
            metaTitle: true,
            metaDescription: true,
        },
    })

    if (!category) {
        return {
            title: "Kategori Bulunamadı",
        }
    }

    return {
        title: category.metaTitle || category.name,
        description: category.metaDescription || category.description || undefined,
        openGraph: {
            title: category.metaTitle || category.name,
            description: category.metaDescription || category.description || undefined,
        },
    }
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
    const { slug } = await params

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                where: {
                    status: "PUBLISHED",
                },
                include: {
                    category: {
                        select: { name: true, slug: true },
                    },
                    reviews: {
                        select: { rating: true },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            children: {
                select: { id: true, name: true, slug: true },
            },
        },
    })

    if (!category) {
        notFound()
    }

    // Map products to include average rating and serialize decimals
    const productsWithRating = category.products.map((product: any) => {
        const avgRating =
            product.reviews.length > 0
                ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
                product.reviews.length
                : 0

        return {
            ...product,
            price: Number(product.price),
            comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
            costPrice: product.costPrice ? Number(product.costPrice) : null,
            taxRate: Number(product.taxRate),
            weight: product.weight ? Number(product.weight) : null,
            width: product.width ? Number(product.width) : null,
            height: product.height ? Number(product.height) : null,
            length: product.length ? Number(product.length) : null,
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: product.reviews.length,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        }
    })

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 border-b pb-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="mb-2 text-4xl font-bold tracking-tight">{category.name}</h1>
                        {category.description && (
                            <p className="text-muted-foreground max-w-2xl">
                                {category.description}
                            </p>
                        )}
                        <p className="text-primary mt-4 text-sm font-medium">
                            {productsWithRating.length} Ürün Bulundu
                        </p>
                    </div>
                    {category.children.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {category.children.map((child: any) => (
                                <Badge
                                    key={child.id}
                                    variant="secondary"
                                    className="hover:bg-secondary/80 cursor-pointer px-3 py-1"
                                    asChild
                                >
                                    <a href={`/categories/${child.slug}`}>{child.name}</a>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {productsWithRating.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {productsWithRating.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="bg-muted/20 rounded-2xl border-2 border-dashed py-20 text-center">
                    <h2 className="text-muted-foreground text-2xl font-bold">
                        Bu kategoride henüz ürün yok
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Diğer kategorilerimize göz atmaya ne dersiniz?
                    </p>
                </div>
            )}
        </div>
    )
}
