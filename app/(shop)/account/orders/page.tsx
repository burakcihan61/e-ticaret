import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { ShoppingBag, Package, ChevronRight } from "lucide-react"
import { OrderStatus } from "@prisma/client"

const statusColors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-500",
    PAYMENT_FAILED: "bg-destructive",
    PAID: "bg-emerald-500",
    PROCESSING: "bg-blue-500",
    SHIPPED: "bg-purple-500",
    DELIVERED: "bg-green-600",
    CANCELLED: "bg-gray-500",
    REFUNDED: "bg-orange-500",
}

const statusLabels: Record<OrderStatus, string> = {
    PENDING: "Ödeme Bekleniyor",
    PAYMENT_FAILED: "Ödeme Başarısız",
    PAID: "Ödeme Alındı",
    PROCESSING: "Hazırlanıyor",
    SHIPPED: "Kargoya Verildi",
    DELIVERED: "Teslim Edildi",
    CANCELLED: "İptal Edildi",
    REFUNDED: "İade Edildi",
}

export default async function OrdersPage() {
    const session = await getSession()
    if (!session) return null // Handled by layout

    const orders = await prisma.order.findMany({
        where: { userId: session.id },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            images: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl">Siparişlerim</CardTitle>
                <CardDescription>
                    Geçmiş ve mevcut tüm siparişlerinizi burada bulabilirsiniz.
                </CardDescription>
            </div>

            {orders.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <ShoppingBag className="text-muted-foreground h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold">Henüz siparişiniz yok</h3>
                        <p className="text-muted-foreground mb-6">Keyifli alışverişler dileriz!</p>
                        <Button asChild>
                            <Link href="/products">Alışverişe Başla</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                            <Package className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Sipariş No:{" "}
                                                <span className="text-primary">
                                                    {order.orderNumber}
                                                </span>
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={statusColors[order.status]}>
                                            {statusLabels[order.status]}
                                        </Badge>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">
                                                {formatPrice(Number(order.total))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="py-4">
                                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-muted h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border"
                                            title={item.name}
                                        >
                                            <img
                                                src={item.product.images[0] || "/placeholder.jpg"}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                    {order.items.length > 5 && (
                                        <div className="bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md border text-xs font-medium">
                                            +{order.items.length - 5}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/10 flex justify-end border-t py-3">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="flex items-center"
                                    >
                                        Detayları Görüntüle
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
