"use client"

import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore, type CartItem } from "@/store/useCartStore"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

interface CartItemComponentProps {
    item: CartItem
}

export default function CartItemComponent({ item }: CartItemComponentProps) {
    const { updateQuantity, removeItem } = useCartStore()

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity > item.stock) {
            return
        }
        updateQuantity(item.productId, newQuantity, item.variantId)
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex gap-4">
                    {/* Product Image */}
                    <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                        <div className="bg-muted h-24 w-24 overflow-hidden rounded-lg">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                    No Image
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-start justify-between">
                            <Link
                                href={`/products/${item.slug}`}
                                className="hover:text-primary line-clamp-2 font-semibold"
                            >
                                {item.name}
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.productId, item.variantId)}
                                className="ml-2 flex-shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center font-medium">
                                    {item.quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.quantity + 1)}
                                    disabled={item.quantity >= item.stock}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                                <p className="text-primary text-lg font-bold">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {formatPrice(item.price)} / adet
                                </p>
                            </div>
                        </div>

                        {/* Stock Warning */}
                        {item.quantity >= item.stock && (
                            <p className="mt-2 text-xs text-orange-500">
                                Maksimum stok: {item.stock}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
