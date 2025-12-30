import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    MoreHorizontal,
    Eye,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Package,
    AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { formatPrice, formatDate } from "@/lib/utils"
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
import OrderActions from "@/components/admin/order-actions"
import { Prisma, OrderStatus } from "@prisma/client"

async function getOrders(options: {
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

    const where: Prisma.OrderWhereInput = {
        AND: [
            search
                ? {
                      OR: [
                          { orderNumber: { contains: search, mode: "insensitive" } },
                          { user: { name: { contains: search, mode: "insensitive" } } },
                          { user: { email: { contains: search, mode: "insensitive" } } },
                      ],
                  }
                : {},
            status && status !== "all" ? { status: status as OrderStatus } : {},
        ],
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            include: {
                user: {
                    select: { name: true, email: true },
                },
                _count: {
                    select: { items: true },
                },
            },
            skip,
            take: pageSize,
        }),
        prisma.order.count({ where }),
    ])

    return {
        orders: orders.map((o: any) => ({
            ...o,
            total: Number(o.total),
        })),
        total,
        totalPages: Math.ceil(total / pageSize),
    }
}

const statusMap = {
    PENDING: { label: "Bekliyor", color: "bg-yellow-500/10 text-yellow-600", icon: Clock },
    PAYMENT_FAILED: { label: "Hatalı", color: "bg-red-500/10 text-red-600", icon: XCircle },
    PAID: { label: "Ödendi", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
    PROCESSING: { label: "İşleniyor", color: "bg-blue-500/10 text-blue-600", icon: Package },
    SHIPPED: { label: "Kargoda", color: "bg-purple-500/10 text-purple-600", icon: Truck },
    DELIVERED: {
        label: "Teslim Edildi",
        color: "bg-green-500/10 text-green-600",
        icon: CheckCircle2,
    },
    CANCELLED: { label: "İptal", color: "bg-slate-500/10 text-slate-600", icon: XCircle },
    REFUNDED: { label: "İade", color: "bg-orange-500/10 text-orange-600", icon: AlertCircle },
}

const statusOptions = Object.entries(statusMap).map(([key, value]) => ({
    label: value.label,
    value: key,
    icon: (value.icon as any).displayName || (value.icon as any).name,
}))

interface AdminOrdersPageProps {
    searchParams: Promise<{
        search?: string
        status?: string
        page?: string
        sortBy?: string
        sortOrder?: string
    }>
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
    const params = await searchParams
    const search = params.search
    const status = params.status
    const page = parseInt(params.page || "1")
    const sortBy = params.sortBy || "createdAt"
    const sortOrder = (params.sortOrder as "asc" | "desc") || "desc"
    const pageSize = 10

    const { orders, total, totalPages } = await getOrders({
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
                    <h1 className="text-3xl font-bold tracking-tight">Sipariş Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Mağazanızdaki tüm siparişleri ve durumlarını yönetin.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <TableSearch placeholder="Sipariş no veya müşteri ara..." />
                </div>
                <TableFilterTabs name="status" options={statusOptions as any} />
            </div>

            <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b text-xs font-medium uppercase">
                            <tr>
                                <th className="px-6 py-4">
                                    <TableSort name="orderNumber" label="Sipariş No" />
                                </th>
                                <th className="px-6 py-4">Müşteri</th>
                                <th className="px-6 py-4">
                                    <TableSort name="createdAt" label="Tarih" />
                                </th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4">
                                    <TableSort name="total" label="Tutar" />
                                </th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-muted-foreground px-6 py-12 text-center"
                                    >
                                        Sonuç bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => {
                                    const StatusIcon =
                                        statusMap[order.status as keyof typeof statusMap].icon
                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-muted/30 group transition-colors"
                                        >
                                            <td className="px-6 py-4 font-mono font-medium">
                                                #{order.orderNumber}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {order.user?.name || "Misafir"}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        {order.user?.email || "-"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-muted-foreground px-6 py-4">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    className={`${statusMap[order.status as keyof typeof statusMap].color} flex w-fit items-center gap-1 border-none font-medium shadow-none`}
                                                >
                                                    <StatusIcon className="h-3 w-3" />
                                                    {
                                                        statusMap[
                                                            order.status as keyof typeof statusMap
                                                        ].label
                                                    }
                                                </Badge>
                                            </td>
                                            <td className="text-primary px-6 py-4 font-semibold">
                                                {formatPrice(order.total)}
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
                                                        className="w-[180px]"
                                                    >
                                                        <DropdownMenuLabel>
                                                            İşlemler
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={`/admin/orders/${order.id}`}
                                                                className="flex items-center"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Detaylar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <OrderActions
                                                            orderId={order.id}
                                                            currentStatus={order.status}
                                                        />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )
                                })
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
