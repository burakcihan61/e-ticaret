"use client"

import { useCartStore } from "@/store/useCartStore"
import CartItemComponent from "@/components/cart/cart-item"
import CartSummary from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
    const { items } = useCartStore()

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-md text-center">
                    <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-24 w-24" />
                    <h1 className="mb-2 text-2xl font-bold">Sepetiniz Boş</h1>
                    <p className="text-muted-foreground mb-6">Henüz sepetinize ürün eklemediniz</p>
                    <Button asChild>
                        <Link href="/products">Alışverişe Başla</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Sepetim ({items.length} ürün)</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Cart Items */}
                <div className="space-y-4 lg:col-span-2">
                    {items.map((item) => (
                        <CartItemComponent
                            key={`${item.productId}-${item.variantId || "default"}`}
                            item={item}
                        />
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                    <CartSummary />
                </div>
            </div>
        </div>
    )
}
