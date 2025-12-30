"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface WishlistItem {
    id: string
    productId: string
    name: string
    slug: string
    price: number
    image?: string
    stock: number
}

interface WishlistStore {
    items: WishlistItem[]
    addItem: (item: WishlistItem) => void
    removeItem: (productId: string) => void
    toggleItem: (item: WishlistItem) => Promise<void>
    isInWishlist: (productId: string) => boolean
    clearWishlist: () => void
    syncWishlist: () => Promise<void>
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items
                if (!items.find((i) => i.productId === item.productId)) {
                    set({ items: [...items, item] })
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((i) => i.productId !== productId),
                })
            },

            toggleItem: async (item) => {
                const items = get().items
                const exists = items.find((i) => i.productId === item.productId)

                // Optimistic update
                if (exists) {
                    get().removeItem(item.productId)
                } else {
                    get().addItem(item)
                }

                try {
                    // Sync with server
                    const response = await fetch("/api/wishlist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ productId: item.productId }),
                    })

                    if (!response.ok && response.status !== 401) {
                        // Rollback on error (except 401 Unauthorized - keep it local only)
                        if (exists) {
                            get().addItem(item)
                        } else {
                            get().removeItem(item.productId)
                        }
                    }
                } catch (error) {
                    console.error("Wishlist sync error:", error)
                }
            },

            isInWishlist: (productId) => {
                return get().items.some((i) => i.productId === productId)
            },

            clearWishlist: () => {
                set({ items: [] })
            },

            syncWishlist: async () => {
                try {
                    const response = await fetch("/api/wishlist")
                    if (response.ok) {
                        const data = await response.json()
                        set({ items: data.items })
                    }
                } catch (error) {
                    console.error("Wishlist fetch error:", error)
                }
            },
        }),
        {
            name: "wishlist-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)
