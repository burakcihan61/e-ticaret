import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CartItem {
    id: string
    productId: string
    name: string
    slug: string
    price: number
    quantity: number
    image?: string
    stock: number
    variantId?: string
}

interface CartStore {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
    removeItem: (productId: string, variantId?: string) => void
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void
    clearCart: () => void
    getItemCount: () => number
    getTotal: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items
                const existingItemIndex = items.findIndex(
                    (i) => i.productId === item.productId && i.variantId === item.variantId
                )

                if (existingItemIndex > -1) {
                    // Update quantity if item exists
                    const newItems = [...items]
                    const newQuantity = newItems[existingItemIndex].quantity + (item.quantity || 1)

                    // Check stock
                    if (newQuantity <= item.stock) {
                        newItems[existingItemIndex].quantity = newQuantity
                        set({ items: newItems })
                    } else {
                        console.warn("Not enough stock")
                    }
                } else {
                    // Add new item
                    set({
                        items: [
                            ...items,
                            {
                                ...item,
                                quantity: item.quantity || 1,
                            },
                        ],
                    })
                }
            },

            removeItem: (productId, variantId) => {
                set({
                    items: get().items.filter(
                        (item) => !(item.productId === productId && item.variantId === variantId)
                    ),
                })
            },

            updateQuantity: (productId, quantity, variantId) => {
                if (quantity <= 0) {
                    get().removeItem(productId, variantId)
                    return
                }

                const items = get().items
                const itemIndex = items.findIndex(
                    (i) => i.productId === productId && i.variantId === variantId
                )

                if (itemIndex > -1) {
                    const newItems = [...items]
                    // Check stock
                    if (quantity <= newItems[itemIndex].stock) {
                        newItems[itemIndex].quantity = quantity
                        set({ items: newItems })
                    } else {
                        console.warn("Not enough stock")
                    }
                }
            },

            clearCart: () => {
                set({ items: [] })
            },

            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },

            getTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)
