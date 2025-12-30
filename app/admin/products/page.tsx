import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Pencil, Eye, Package, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TableSearch from "@/components/admin/table-search"
import TableFilterTabs from "@/components/admin/table-filter-tabs"
import TableSort from "@/components/admin/table-sort"
import TablePagination from "@/components/admin/table-pagination"
import DeleteAction from "@/components/admin/delete-action"
import { Prisma } from "@prisma/client"

async function getProducts(options: {
    search?: string
    status?: string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
}) {
    const {
        search,
        status,
        page = 1,
        pageSize = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = options

    const skip = (page - 1) * pageSize

    const where: Prisma.ProductWhereInput = {
        AND: [
            search
                ? {
                      OR: [
                          { name: { contains: search, mode: "insensitive" } },
                          { slug: { contains: search, mode: "insensitive" } },
                          { sku: { contains: search, mode: "insensitive" } },
                      ],
                  }
                : {},
            status && status !== "all" ? { status: status as any } : {},
        ],
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            include: {
                category: {
                    select: { name: true },
                },
            },
            skip,
            take: pageSize,
        }),
        prisma.product.count({ where }),
    ])

    return {
        products: products.map((p: any) => ({
            ...p,
            price: Number(p.price),
            comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        })),
        total,
        totalPages: Math.ceil(total / pageSize),
    }
}

const productStatusOptions = [
    { label: "Yayında", value: "PUBLISHED", icon: "Package" },
    { label: "Taslak", value: "DRAFT", icon: "Pencil" },
]

interface AdminProductsPageProps {
    searchParams: Promise<{
        search?: string
        status?: string
        page?: string
        sortBy?: string
        sortOrder?: string
    }>
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
    const params = await searchParams
    const search = params.search
    const status = params.status
    const page = parseInt(params.page || "1")
    const sortBy = params.sortBy || "createdAt"
    const sortOrder = (params.sortOrder as "asc" | "desc") || "desc"
    const pageSize = 10

    const { products, total, totalPages } = await getProducts({
        search,
        status,
        page,
        pageSize,
        sortBy,
        sortOrder,
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ürün Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Mağazanızdaki ürünleri ekleyin, düzenleyin veya silin.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Ürün Ekle
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <TableSearch placeholder="Ürün adı, SKU veya slug ara..." />
                </div>
                <TableFilterTabs name="status" options={productStatusOptions} />
            </div>

            <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b text-xs font-medium uppercase">
                            <tr>
                                <th className="px-6 py-4">
                                    <TableSort name="name" label="Ürün" />
                                </th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">
                                    <TableSort name="price" label="Fiyat" />
                                </th>
                                <th className="px-6 py-4">
                                    <TableSort name="stock" label="Stok" />
                                </th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-muted-foreground px-6 py-12 text-center"
                                    >
                                        Sonuç bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: any) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-muted/30 group transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border">
                                                    {product.images[0] ? (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="text-muted-foreground h-5 w-5" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-foreground group-hover:text-primary font-medium transition-colors">
                                                        {product.name}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        SKU: {product.sku}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline">
                                                {product.category?.name || "Kategorisiz"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {product.stock <= product.lowStockThreshold ? (
                                                    <AlertCircle className="text-destructive h-4 w-4" />
                                                ) : null}
                                                <span
                                                    className={
                                                        product.stock <= product.lowStockThreshold
                                                            ? "text-destructive font-bold"
                                                            : ""
                                                    }
                                                >
                                                    {product.stock} Adet
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={
                                                    product.status === "PUBLISHED"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {product.status === "PUBLISHED"
                                                    ? "Yayında"
                                                    : "Taslak"}
                                            </Badge>
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
                                                            href={`/admin/products/${product.id}`}
                                                            className="flex items-center"
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Düzenle
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/products/${product.slug}`}
                                                            target="_blank"
                                                            className="flex items-center text-blue-600"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Görüntüle
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DeleteAction
                                                        id={product.id}
                                                        resourceType="products"
                                                        resourceName={product.name}
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
