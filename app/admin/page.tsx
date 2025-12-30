import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

async function getStats() {
    const [totalRevenue, orderCount, productCount, userCount, recentOrders] = await Promise.all([
        // Total Revenue (only from paid/delivered orders)
        prisma.order.aggregate({
            where: {
                status: {
                    in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
                },
            },
            _sum: {
                subtotal: true,
            },
        }),
        // Total Orders
        prisma.order.count(),
        // Total Products
        prisma.product.count(),
        // Total Users
        prisma.user.count({
            where: { role: "USER" },
        }),
        // Recent Orders
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { name: true, email: true },
                },
            },
        }),
    ])

    return {
        revenue: Number(totalRevenue._sum.subtotal || 0),
        orders: orderCount,
        products: productCount,
        users: userCount,
        recentOrders,
    }
}

export default async function AdminDashboardPage() {
    const stats = await getStats()

    const cards = [
        {
            title: "Toplam Gelir",
            value: formatPrice(stats.revenue),
            icon: TrendingUp,
            description: "Onaylanmış siparişler",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Toplam Sipariş",
            value: stats.orders.toString(),
            icon: ShoppingCart,
            description: "Tüm zamanlar",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Toplam Ürün",
            value: stats.products.toString(),
            icon: Package,
            description: "Envanterdeki çeşit",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
        {
            title: "Aktif Müşteriler",
            value: stats.users.toString(),
            icon: Users,
            description: "Kayıtlı kullanıcılar",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                    Mağazanızın performansı ve özeti burada yer alır.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <div className={`${card.bg} ${card.color} rounded-md p-2`}>
                                <card.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-muted-foreground mt-1 text-xs">{card.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Satış Analizi</CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Ay bazında satış grafiği burada gösterilecek.
                        </p>
                    </CardHeader>
                    <CardContent className="flex h-[300px] items-center justify-center border-t">
                        <p className="text-muted-foreground italic">
                            (Grafik bileşeni yakında eklenecek)
                        </p>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Son Siparişler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {stats.recentOrders.length === 0 ? (
                                <p className="text-muted-foreground py-8 text-center text-sm">
                                    Henüz sipariş yok.
                                </p>
                            ) : (
                                stats.recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center gap-4">
                                        <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-full">
                                            <CreditCard className="text-muted-foreground h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {order.user?.name || "Misafir Kullanıcı"}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                Order #{order.orderNumber}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {formatPrice(Number(order.subtotal))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
