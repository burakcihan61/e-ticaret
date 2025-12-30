import ProductCard from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"

export default async function ProductsPage() {
    // Fetch products from database
    const products = await prisma.product.findMany({
        where: {
            status: "PUBLISHED",
        },
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
            createdAt: "desc",
        },
        take: 12,
    })

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
        const avgRating =
            product.reviews.length > 0
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Tüm Ürünler</h1>
                <p className="text-muted-foreground mt-2">{products.length} ürün bulundu</p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {productsWithRating.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">Henüz ürün bulunmuyor</p>
                    <Button asChild>
                        <a href="/home">Ana Sayfaya Dön</a>
                    </Button>
                </div>
            )}
        </div>
    )
}
