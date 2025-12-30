"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/useCartStore"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

export default function CartSummary() {
    const { items, getTotal } = useCartStore()

    const subtotal = getTotal()
    const shipping = subtotal > 500 ? 0 : 29.99
    const tax = subtotal * 0.2 // 20% KDV
    const total = subtotal + shipping + tax

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ara Toplam</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
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
                    <span className="font-semibold">Toplam</span>
                    <span className="text-primary text-xl font-bold">{formatPrice(total)}</span>
                </div>

                {shipping > 0 && (
                    <p className="text-muted-foreground text-xs">
                        {formatPrice(500 - subtotal)} daha alışveriş yapın, kargo ücretsiz!
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" size="lg" asChild disabled={items.length === 0}>
                    <Link href="/checkout">Ödemeye Geç</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/products">Alışverişe Devam Et</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
