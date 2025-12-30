import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import CategoryForm from "@/components/admin/category-form"

interface AdminCategoryPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function AdminCategoryPage({ params }: AdminCategoryPageProps) {
    const { id } = await params
    const isNew = id === "new"

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    })

    let category = null
    if (!isNew) {
        category = await prisma.category.findUnique({
            where: { id },
        })

        if (!category) {
            notFound()
        }
    }

    return (
        <div className="container mx-auto">
            <CategoryForm initialData={category} categories={categories} />
        </div>
    )
}
