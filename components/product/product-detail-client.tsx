"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield } from "lucide-react"
import { formatPrice, calculateDiscount, formatDate } from "@/lib/utils"
import { useCartStore } from "@/store/useCartStore"
import { useWishlistStore } from "@/store/useWishlistStore"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface ProductDetailClientProps {
    product: any
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const addItem = useCartStore((state) => state.addItem)
    const toggleWishlist = useWishlistStore((state) => state.toggleItem)
    const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id))
    const [isAdding, setIsAdding] = useState(false)

    const avgRating =
        product.reviews.length > 0
            ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
              product.reviews.length
            : 0

    const discount = product.comparePrice
        ? calculateDiscount(Number(product.price), Number(product.comparePrice))
        : 0

    const isOutOfStock = product.stock === 0

    const handleAddToCart = () => {
        setIsAdding(true)

        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
            image: product.images[0],
            stock: product.stock,
        })

        toast.success(`${product.name} sepete eklendi`, {
            description: "Alışverişe devam edebilir veya sepetinize gidebilirsiniz.",
            action: {
                label: "Sepete Git",
                onClick: () => (window.location.href = "/cart"),
            },
        })

        setTimeout(() => setIsAdding(false), 1000)
    }

    const handleToggleWishlist = () => {
        toggleWishlist({
            id: product.id,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
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
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-muted-foreground mb-8 flex items-center gap-2 text-sm">
                <Link href="/home" className="hover:text-primary">
                    Ana Sayfa
                </Link>
                <span>/</span>
                <Link href="/products" className="hover:text-primary">
                    Ürünler
                </Link>
                <span>/</span>
                <Link href={`/categories/${product.category.slug}`} className="hover:text-primary">
                    {product.category.name}
                </Link>
                <span>/</span>
                <span className="text-foreground">{product.name}</span>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Product Images */}
                <div>
                    <div className="bg-muted mb-4 aspect-square overflow-hidden rounded-lg">
                        {product.images[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <ShoppingCart className="text-muted-foreground h-24 w-24" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    {/* Badges */}
                    <div className="mb-4 flex gap-2">
                        {product.isNew && <Badge className="bg-blue-500">Yeni</Badge>}
                        {discount > 0 && <Badge variant="destructive">%{discount} İndirim</Badge>}
                        {isOutOfStock && <Badge variant="secondary">Stokta Yok</Badge>}
                    </div>

                    {/* Brand */}
                    {product.brand && (
                        <p className="text-muted-foreground mb-2 text-sm">{product.brand.name}</p>
                    )}

                    {/* Title */}
                    <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>

                    {/* Rating */}
                    {product.reviews.length > 0 && (
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-5 w-5 ${
                                            star <= Math.round(avgRating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
                            <span className="text-muted-foreground text-sm">
                                ({product.reviews.length} değerlendirme)
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mb-6 flex items-center gap-4">
                        <span className="text-primary text-4xl font-bold">
                            {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                            <span className="text-muted-foreground text-xl line-through">
                                {formatPrice(product.comparePrice)}
                            </span>
                        )}
                    </div>

                    {/* Short Description */}
                    {product.shortDescription && (
                        <p className="text-muted-foreground mb-6">{product.shortDescription}</p>
                    )}

                    {/* Stock Info */}
                    <div className="mb-6">
                        {isOutOfStock ? (
                            <p className="text-destructive font-medium">Stokta Yok</p>
                        ) : product.stock <= product.lowStockThreshold ? (
                            <p className="font-medium text-orange-500">Son {product.stock} ürün!</p>
                        ) : (
                            <p className="font-medium text-green-600">Stokta Var</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mb-8 flex gap-4">
                        <Button
                            size="lg"
                            className="flex-1"
                            disabled={isOutOfStock || isAdding}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {isAdding ? "Eklendi ✓" : "Sepete Ekle"}
                        </Button>
                        <Button size="lg" variant="outline" onClick={handleToggleWishlist}>
                            <Heart
                                className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
                            />
                        </Button>
                        <Button size="lg" variant="outline">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Features */}
                    <div className="mb-8 grid grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <Truck className="text-primary h-5 w-5" />
                                <div>
                                    <p className="text-sm font-medium">Ücretsiz Kargo</p>
                                    <p className="text-muted-foreground text-xs">500 TL üzeri</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <Shield className="text-primary h-5 w-5" />
                                <div>
                                    <p className="text-sm font-medium">Güvenli Ödeme</p>
                                    <p className="text-muted-foreground text-xs">SSL Korumalı</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">SKU:</span>
                            <span className="font-medium">{product.sku}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Kategori:</span>
                            <Link
                                href={`/categories/${product.category.slug}`}
                                className="hover:text-primary font-medium"
                            >
                                {product.category.name}
                            </Link>
                        </div>
                        {product.brand && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Marka:</span>
                                <span className="font-medium">{product.brand.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            {product.description && (
                <div className="mb-12">
                    <h2 className="mb-4 text-2xl font-bold">Ürün Açıklaması</h2>
                    <div className="prose max-w-none">
                        <p className="text-muted-foreground">{product.description}</p>
                    </div>
                </div>
            )}

            {/* Attributes */}
            {product.attributes.length > 0 && (
                <div className="mb-12">
                    <h2 className="mb-4 text-2xl font-bold">Ürün Özellikleri</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {product.attributes.map((attr: any) => (
                            <div
                                key={attr.id}
                                className="bg-muted flex justify-between rounded-lg p-4"
                            >
                                <span className="font-medium">{attr.name}</span>
                                <span className="text-muted-foreground">{attr.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews */}
            {product.reviews.length > 0 && (
                <div>
                    <h2 className="mb-4 text-2xl font-bold">
                        Müşteri Değerlendirmeleri ({product.reviews.length})
                    </h2>
                    <div className="space-y-4">
                        {product.reviews.map((review: any) => (
                            <Card key={review.id}>
                                <CardContent className="p-6">
                                    <div className="mb-2 flex items-start justify-between">
                                        <div>
                                            <p className="font-medium">
                                                {review.user.name || review.user.email}
                                            </p>
                                            <div className="mt-1 flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-4 w-4 ${
                                                            star <= review.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-muted-foreground text-sm">
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                    {review.title && (
                                        <h4 className="mb-2 font-medium">{review.title}</h4>
                                    )}
                                    {review.comment && (
                                        <p className="text-muted-foreground">{review.comment}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
