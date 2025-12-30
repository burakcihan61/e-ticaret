import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Pencil, LayoutGrid } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TableSearch from "@/components/admin/table-search"
import TableSort from "@/components/admin/table-sort"
import TablePagination from "@/components/admin/table-pagination"
import DeleteAction from "@/components/admin/delete-action"
import { Prisma } from "@prisma/client"

async function getCategories(options: {
    search?: string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
}) {
    const { search, page = 1, pageSize = 10, sortBy = "createdAt", sortOrder = "desc" } = options

    const skip = (page - 1) * pageSize

    const where: Prisma.CategoryWhereInput = search
        ? {
              OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { slug: { contains: search, mode: "insensitive" } },
              ],
          }
        : {}

    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            include: {
                _count: {
                    select: { products: true, children: true },
                },
                parent: {
                    select: { name: true },
                },
            },
            skip,
            take: pageSize,
        }),
        prisma.category.count({ where }),
    ])

    return {
        categories,
        total,
        totalPages: Math.ceil(total / pageSize),
    }
}

interface AdminCategoriesPageProps {
    searchParams: Promise<{
        search?: string
        page?: string
        sortBy?: string
        sortOrder?: string
    }>
}

export default async function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
    const params = await searchParams
    const search = params.search
    const page = parseInt(params.page || "1")
    const sortBy = params.sortBy || "createdAt"
    const sortOrder = (params.sortOrder as "asc" | "desc") || "desc"
    const pageSize = 10

    const { categories, total, totalPages } = await getCategories({
        search,
        page,
        pageSize,
        sortBy,
        sortOrder,
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kategori Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Ürün kategorilerini ve hiyerarşisini yönetin.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/categories/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Kategori Ekle
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <TableSearch placeholder="Kategori adı veya slug ara..." />
            </div>

            <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b text-xs font-medium uppercase">
                            <tr>
                                <th className="px-6 py-4">
                                    <TableSort name="name" label="Kategori" />
                                </th>
                                <th className="px-6 py-4">Üst Kategori</th>
                                <th className="px-6 py-4">Alt Kategoriler</th>
                                <th className="px-6 py-4">Ürün Sayısı</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {categories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-muted-foreground px-6 py-12 text-center"
                                    >
                                        Sonuç bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category: any) => (
                                    <tr
                                        key={category.id}
                                        className="hover:bg-muted/30 group transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border">
                                                    {category.image ? (
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <LayoutGrid className="text-muted-foreground h-5 w-5" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-foreground group-hover:text-primary font-medium transition-colors">
                                                        {category.name}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        /{category.slug}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground px-6 py-4">
                                            {category.parent?.name || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {category._count.children} Alt Kategori
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {category._count.products} Ürün
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-[160px]"
                                                >
                                                    <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/admin/categories/${category.id}`}
                                                            className="flex items-center"
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Düzenle
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DeleteAction
                                                        id={category.id}
                                                        resourceType="categories"
                                                        resourceName={category.name}
                                                    />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <TablePagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={total}
                    pageSize={pageSize}
                />
            </div>
        </div>
    )
}
