"use client"

import { useWishlistStore } from "@/store/useWishlistStore"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { Heart, ShoppingBag } from "lucide-react"
import ProductCard from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function WishlistPage() {
    const items = useWishlistStore((state) => state.items)
    const syncWishlist = useWishlistStore((state) => state.syncWishlist)
    const [isLoaded, setIsLoaded] = useState(false)

    // Wait for hydration and sync
    useEffect(() => {
        const init = async () => {
            await syncWishlist()
            setIsLoaded(true)
        }
        init()
    }, [syncWishlist])

    if (!isLoaded) return null

    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl">Favorilerim</CardTitle>
                <CardDescription>
                    Beğendiğiniz ve daha sonra satın almak istediğiniz ürünler.
                </CardDescription>
            </div>

            {items.length === 0 ? (
                <div className="bg-card flex flex-col items-center justify-center rounded-lg border py-20 text-center">
                    <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                        <Heart className="text-muted-foreground h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold">Favori listeniz henüz boş</h3>
                    <p className="text-muted-foreground mb-6">
                        Beğendiğiniz ürünleri buraya eklemeye ne dersiniz?
                    </p>
                    <Button asChild>
                        <Link href="/products">Ürünleri İncele</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <ProductCard
                            key={item.productId}
                            product={{
                                id: item.productId,
                                name: item.name,
                                slug: item.slug,
                                price: item.price,
                                images: item.image ? [item.image] : [],
                                stock: item.stock,
                                // These are optional in ProductCard but good to have
                                averageRating: 0,
                                reviewCount: 0,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
