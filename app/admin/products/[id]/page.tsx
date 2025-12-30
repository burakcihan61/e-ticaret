import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductForm from "@/components/admin/product-form"

interface AdminProductPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function AdminProductPage({ params }: AdminProductPageProps) {
    const { id } = await params
    const isNew = id === "new"

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    })

    let product = null
    if (!isNew) {
        product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    select: { id: true, name: true },
                },
            },
        })

        if (!product) {
            notFound()
        }
    }

    return (
        <div className="container mx-auto">
            <ProductForm
                initialData={
                    product
                        ? {
                              ...product,
                              price: Number(product.price),
                              comparePrice: product.comparePrice
                                  ? Number(product.comparePrice)
                                  : undefined,
                              stock: Number(product.stock),
                          }
                        : undefined
                }
                categories={categories}
            />
        </div>
    )
}
