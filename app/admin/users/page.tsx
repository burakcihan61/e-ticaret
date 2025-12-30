import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    MoreHorizontal,
    Shield,
    User,
    Mail,
    Calendar,
    Unlock,
    Lock,
    Pencil,
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import TableSearch from "@/components/admin/table-search"
import TableFilterTabs from "@/components/admin/table-filter-tabs"
import TableSort from "@/components/admin/table-sort"
import TablePagination from "@/components/admin/table-pagination"
import UserActions from "@/components/admin/user-actions"

// Fix for Prisma import issues - using types from global prisma client if available
// or defaulting to any to bypass linting errors for now
type UserRole = any
type Prisma = any

async function getUsers(options: {
    search?: string
    role?: string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
}) {
    const {
        search,
        role,
        page = 1,
        pageSize = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = options

    const skip = (page - 1) * pageSize

    const where: any = {
        AND: [
            search
                ? {
                      OR: [
                          { name: { contains: search, mode: "insensitive" } },
                          { email: { contains: search, mode: "insensitive" } },
                      ],
                  }
                : {},
            role && role !== "all" ? { role: role as UserRole } : {},
        ],
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                _count: {
                    select: { orders: true },
                },
            },
            skip,
            take: pageSize,
        }),
        prisma.user.count({ where }),
    ])

    return {
        users,
        total,
        totalPages: Math.ceil(total / pageSize),
    }
}

const roleOptions = [
    { label: "Müşteriler", value: "USER", icon: "User" },
    { label: "Yöneticiler", value: "ADMIN", icon: "Shield" },
]

interface AdminUsersPageProps {
    searchParams: Promise<{
        search?: string
        role?: string
        page?: string
        sortBy?: string
        sortOrder?: string
    }>
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
    const params = await searchParams
    const search = params.search
    const role = params.role
    const page = parseInt(params.page || "1")
    const sortBy = params.sortBy || "createdAt"
    const sortOrder = (params.sortOrder as "asc" | "desc") || "desc"
    const pageSize = 10

    const { users, total, totalPages } = await getUsers({
        search,
        role,
        page,
        pageSize,
        sortBy,
        sortOrder,
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Kayıtlı kullanıcıları yönetin ve rollerini düzenleyin.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <TableSearch placeholder="İsim veya email ara..." />
                </div>
                <TableFilterTabs name="role" options={roleOptions} />
            </div>

            <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b text-xs font-medium uppercase">
                            <tr>
                                <th className="px-6 py-4">
                                    <TableSort name="name" label="Kullanıcı" />
                                </th>
                                <th className="px-6 py-4">
                                    <TableSort name="email" label="Email" />
                                </th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Sipariş Sayısı</th>
                                <th className="px-6 py-4">
                                    <TableSort name="createdAt" label="Kayıt Tarihi" />
                                </th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-muted-foreground px-6 py-12 text-center"
                                    >
                                        Sonuç bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user: any) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-muted/30 group transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="hover:text-primary font-medium underline-offset-4 transition-colors hover:underline"
                                                >
                                                    {user.name || "İsimsiz Kullanıcı"}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-muted-foreground flex items-center gap-2">
                                                <Mail className="h-3.5 w-3.5" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <Badge
                                                    variant={
                                                        user.role === "ADMIN" ||
                                                        user.role === "SUPER_ADMIN"
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    className="flex w-fit items-center gap-1 border-none font-medium shadow-none"
                                                >
                                                    {user.role === "ADMIN" ||
                                                    user.role === "SUPER_ADMIN" ? (
                                                        <Shield className="h-3 w-3" />
                                                    ) : null}
                                                    {user.role}
                                                </Badge>
                                                {user.status === "SUSPENDED" && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="flex h-4 w-fit items-center gap-1 border-none px-1.5 py-0 text-[10px] font-bold shadow-none"
                                                    >
                                                        <Lock className="h-2.5 w-2.5" />
                                                        ASKIDA
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {user._count.orders} Sipariş
                                        </td>
                                        <td className="text-muted-foreground px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <UserActions user={user} />
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
