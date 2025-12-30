"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { useCartStore } from "@/store/useCartStore"
import { useWishlistStore } from "@/store/useWishlistStore"
import { useState } from "react"
import { toast } from "sonner"

interface ProductCardProps {
    product: {
        id: string
        name: string
        slug: string
        price: number
        comparePrice?: number | null
        images: string[]
        isFeatured?: boolean
        isNew?: boolean
        stock: number
        averageRating?: number
        reviewCount?: number
        category?: {
            name: string
            slug: string
        } | null
        brand?: {
            name: string
        } | null
    }
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)
    const toggleWishlist = useWishlistStore((state) => state.toggleItem)
    const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id))
    const [isAdding, setIsAdding] = useState(false)

    const discount = product.comparePrice
        ? calculateDiscount(Number(product.price), Number(product.comparePrice))
        : 0

    const isOutOfStock = product.stock === 0

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsAdding(true)

        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images[0],
            stock: product.stock,
        })

        toast.success(`${product.name} sepete eklendi`)

        setTimeout(() => setIsAdding(false), 500)
    }

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        toggleWishlist({
            id: product.id,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images[0],
            stock: product.stock,
        })

        if (!isInWishlist) {
            toast.success(`${product.name} favorilere eklendi`)
        } else {
            toast.info(`${product.name} favorilerden çıkarıldı`)
        }
    }

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <Link href={`/products/${product.slug}`}>
                <div className="bg-muted relative aspect-square overflow-hidden">
                    {product.images[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ShoppingCart className="text-muted-foreground h-16 w-16" />
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={handleToggleWishlist}
                        className="text-muted-foreground absolute right-2 top-2 z-10 rounded-full bg-white/80 p-2 opacity-0 transition-all hover:bg-white hover:text-red-500 group-hover:opacity-100"
                    >
                        <Heart
                            className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
                        />
                    </button>

                    {/* Badges */}
                    <div className="absolute left-2 top-2 flex flex-col gap-2">
                        {product.isNew && <Badge className="bg-blue-500">Yeni</Badge>}
                        {discount > 0 && <Badge variant="destructive">%{discount} İndirim</Badge>}
                        {isOutOfStock && <Badge variant="secondary">Stokta Yok</Badge>}
                    </div>
                </div>
            </Link>

            <CardContent className="p-4">
                {/* Category & Brand */}
                {(product.category || product.brand) && (
                    <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
                        {product.category && (
                            <Link
                                href={`/categories/${product.category.slug}`}
                                className="hover:text-primary"
                            >
                                {product.category.name}
                            </Link>
                        )}
                        {product.category && product.brand && <span>•</span>}
                        {product.brand && <span>{product.brand.name}</span>}
                    </div>
                )}

                {/* Product Name */}
                <Link href={`/products/${product.slug}`}>
                    <h3 className="group-hover:text-primary mb-2 line-clamp-2 font-semibold transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                {product.averageRating && product.reviewCount ? (
                    <div className="mb-3 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.averageRating}</span>
                        <span className="text-muted-foreground text-xs">
                            ({product.reviewCount})
                        </span>
                    </div>
                ) : null}

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-primary text-lg font-bold">
                        {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                        <span className="text-muted-foreground text-sm line-through">
                            {formatPrice(product.comparePrice)}
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    disabled={isOutOfStock || isAdding}
                    onClick={handleAddToCart}
                >
                    {isAdding ? (
                        "Eklendi ✓"
                    ) : isOutOfStock ? (
                        "Stokta Yok"
                    ) : (
                        <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Sepete Ekle
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
