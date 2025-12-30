import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

interface OrderDetailPageProps {
    params: Promise<{
        orderId: string
    }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { orderId } = await params

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            name: true,
                            slug: true,
                            images: true,
                        },
                    },
                },
            },
            payment: true,
            shippingAddress: true,
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    })

    if (!order) {
        notFound()
    }

    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-blue-100 text-blue-800",
        PROCESSING: "bg-purple-100 text-purple-800",
        SHIPPED: "bg-indigo-100 text-indigo-800",
        DELIVERED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        REFUNDED: "bg-gray-100 text-gray-800",
    }

    const paymentStatusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        PAID: "bg-green-100 text-green-800",
        FAILED: "bg-red-100 text-red-800",
        REFUNDED: "bg-gray-100 text-gray-800",
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Sipariş Detayı</h1>
                    <p className="text-muted-foreground">
                        Sipariş No: <span className="font-medium">{order.orderNumber}</span>
                    </p>
                </div>

                {/* Status Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-6">
                        <p className="text-muted-foreground mb-2 text-sm">Sipariş Durumu</p>
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]
                                }`}
                        >
                            {order.status}
                        </span>
                    </div>
                    <div className="rounded-lg border p-6">
                        <p className="text-muted-foreground mb-2 text-sm">Ödeme Durumu</p>
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${paymentStatusColors[
                                order.paymentStatus as keyof typeof paymentStatusColors
                                ]
                                }`}
                        >
                            {order.paymentStatus}
                        </span>
                    </div>
                </div>

                {/* Order Items */}
                <div className="mb-6 rounded-lg border p-6">
                    <h2 className="mb-4 text-xl font-semibold">Sipariş Ürünleri</h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                                <div className="bg-muted h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                                    {item.product?.images[0] ? (
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-muted-foreground text-sm">
                                        {item.quantity} x ₺{Number(item.price).toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">
                                        ₺{(Number(item.price) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Summary */}
                <div className="mb-6 rounded-lg border p-6">
                    <h2 className="mb-4 text-xl font-semibold">Fiyat Özeti</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Ara Toplam</span>
                            <span>₺{Number(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Kargo</span>
                            <span>₺{Number(order.shippingCost).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">KDV</span>
                            <span>₺{Number(order.tax).toFixed(2)}</span>
                        </div>
                        {Number(order.discount) > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span className="flex items-center gap-2">
                                    İndirim
                                    {order.couponCode && (
                                        <span className="rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                            {order.couponCode}
                                        </span>
                                    )}
                                </span>
                                <span>-₺{Number(order.discount).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between border-t pt-2 text-lg font-bold">
                            <span>Toplam</span>
                            <span className="text-primary">₺{Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg border p-6">
                        <h2 className="mb-3 text-lg font-semibold">Teslimat Adresi</h2>
                        <div className="space-y-1 text-sm">
                            <p className="font-medium">
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                            </p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                                {order.shippingAddress.district}, {order.shippingAddress.city}
                            </p>
                            {order.shippingAddress.postalCode && (
                                <p>{order.shippingAddress.postalCode}</p>
                            )}
                            <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                        </div>
                    </div>

                    {order.payment && (
                        <div className="rounded-lg border p-6">
                            <h2 className="mb-3 text-lg font-semibold">Ödeme Bilgileri</h2>
                            <div className="space-y-1 text-sm">
                                <p>
                                    <span className="text-muted-foreground">Ödeme Yöntemi:</span>{" "}
                                    {order.payment.paymentMethod === "CREDIT_CARD"
                                        ? "Kredi Kartı"
                                        : order.payment.paymentMethod === "DEBIT_CARD"
                                            ? "Banka Kartı"
                                            : order.payment.paymentMethod === "BANK_TRANSFER"
                                                ? "Havale / EFT"
                                                : "Kapıda Ödeme"}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">İşlem No:</span>{" "}
                                    {order.payment.iyzicoPaymentId ||
                                        order.payment.iyzicoTransactionId ||
                                        "-"}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Tutar:</span> ₺
                                    {Number(order.payment.amount).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
