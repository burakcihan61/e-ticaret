import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ShoppingCart,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    CreditCard,
} from "lucide-react"
import Link from "next/link"
import { formatPrice, formatDate } from "@/lib/utils"
// We'll create a client component for status updates to avoid page refreshes
import OrderStatusSelect from "@/components/admin/order-status-select"

interface AdminOrderDetailPageProps {
    params: {
        id: string
    }
}

async function getOrder(id: string) {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: {
                select: { name: true, email: true },
            },
            items: {
                include: {
                    product: {
                        select: { images: true },
                    },
                },
            },
            shippingAddress: true,
            statusHistory: {
                orderBy: { createdAt: "desc" },
            },
        },
    })

    if (!order) return null

    return {
        ...order,
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        total: Number(order.total),
        items: order.items.map((item) => ({
            ...item,
            price: Number(item.price),
        })),
    }
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
    const { id } = await params
    const order = await getOrder(id)

    if (!order) {
        notFound()
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/orders">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Sipariş Detayı</h1>
                        <p className="text-muted-foreground">Order #{order.orderNumber}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Items List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Sipariş İçeriği
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-muted flex h-16 w-16 items-center justify-center overflow-hidden rounded border">
                                                {item.product?.images[0] ? (
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="text-muted-foreground h-8 w-8" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-muted-foreground text-sm">
                                                    {item.quantity} x {formatPrice(item.price)}
                                                </p>
                                                {item.sku && (
                                                    <p className="text-muted-foreground font-mono text-[10px]">
                                                        SKU: {item.sku}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-primary font-semibold">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 space-y-2 border-t pt-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Ara Toplam</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Kargo</span>
                                    <span>{formatPrice(order.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Toplam</span>
                                    <span className="text-primary">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Sipariş Geçmişi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {order.statusHistory.map((history, idx) => (
                                    <div key={history.id} className="relative flex gap-4">
                                        {idx !== order.statusHistory.length - 1 && (
                                            <div className="bg-muted absolute bottom-[-24px] left-[11px] top-6 w-[2px]" />
                                        )}
                                        <div className="bg-primary/10 border-primary/20 z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2">
                                            <CheckCircle2 className="text-primary h-3.5 w-3.5" />
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-sm font-semibold">
                                                {history.status}
                                            </p>
                                            {history.note && (
                                                <p className="text-muted-foreground mt-1 text-xs">
                                                    {history.note}
                                                </p>
                                            )}
                                            <p className="text-muted-foreground mt-1 text-[10px]">
                                                {formatDate(history.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5" />
                                Müşteri Bilgileri
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="font-medium">
                                    {order.user?.name || "Misafir Kullanıcı"}
                                </p>
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <Mail className="h-3.5 w-3.5" />
                                    {order.user?.email || "-"}
                                </div>
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <Phone className="h-3.5 w-3.5" />
                                    {order.shippingAddress?.phone || "-"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5" />
                                Teslimat Adresi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <p className="mb-1 font-medium">
                                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                {order.shippingAddress?.address}
                                <br />
                                {order.shippingAddress?.district}, {order.shippingAddress?.city}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CreditCard className="h-5 w-5" />
                                Ödeme Detayları
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Yöntem</span>
                                <span className="font-medium">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Durum</span>
                                <Badge
                                    variant="outline"
                                    className="border-none bg-emerald-500/10 text-emerald-600"
                                >
                                    {order.paymentStatus}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
