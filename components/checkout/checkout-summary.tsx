"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/store/useCartStore"
import { formatPrice } from "@/lib/utils"
import { Loader2, Ticket } from "lucide-react"

interface CheckoutSummaryProps {
    discount?: number
    couponCode?: string | null
    onApplyCoupon?: (code: string) => Promise<boolean>
    onRemoveCoupon?: () => void
}

export default function CheckoutSummary({
    discount = 0,
    couponCode,
    onApplyCoupon,
    onRemoveCoupon,
}: CheckoutSummaryProps) {
    const { items, getTotal } = useCartStore()
    const [code, setCode] = useState("")
    const [isApplying, setIsApplying] = useState(false)

    const subtotal = getTotal()
    const shipping = subtotal > 500 ? 0 : 29.99
    const tax = subtotal * 0.2 // 20% KDV
    const total = subtotal + shipping + tax - discount

    const handleApply = async () => {
        if (!code || !onApplyCoupon) return
        setIsApplying(true)
        try {
            const success = await onApplyCoupon(code)
            if (success) setCode("")
        } finally {
            setIsApplying(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={`${item.productId}-${item.variantId || "default"}`}
                            className="flex justify-between text-sm"
                        >
                            <div className="flex-1">
                                <p className="line-clamp-1 font-medium">{item.name}</p>
                                <p className="text-muted-foreground">
                                    {item.quantity} x {formatPrice(item.price)}
                                </p>
                            </div>
                            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Coupon Input */}
                {onApplyCoupon && (
                    <div className="space-y-2">
                        {couponCode ? (
                            <div className="flex items-center justify-between rounded border border-green-500/30 bg-green-500/15 p-2">
                                <span className="flex items-center text-sm font-medium text-green-700 dark:text-green-400">
                                    <Ticket className="mr-2 h-4 w-4" />
                                    {couponCode}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onRemoveCoupon}
                                    className="h-6 text-xs text-red-500 hover:text-red-600"
                                >
                                    Kaldır
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Kupon Kodu"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="h-9"
                                />
                                <Button
                                    size="sm"
                                    onClick={handleApply}
                                    disabled={!code || isApplying}
                                >
                                    {isApplying && (
                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    )}
                                    Uygula
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ara Toplam</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-sm font-medium text-green-600">
                            <span>İndirim ({couponCode})</span>
                            <span>-{formatPrice(discount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kargo</span>
                        <span className="font-medium">
                            {shipping === 0 ? (
                                <span className="text-green-600">Ücretsiz</span>
                            ) : (
                                formatPrice(shipping)
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">KDV (%20)</span>
                        <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                    <span className="text-lg font-semibold">Toplam</span>
                    <span className="text-primary text-xl font-bold">{formatPrice(total)}</span>
                </div>

                {shipping > 0 && (
                    <p className="text-muted-foreground text-center text-xs">
                        {formatPrice(500 - subtotal)} daha alışveriş yapın, kargo ücretsiz!
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
