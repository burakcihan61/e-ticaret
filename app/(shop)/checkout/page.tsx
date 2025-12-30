"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/useCartStore"
import AddressForm, { type AddressFormData } from "@/components/checkout/address-form"
import AddressSelector from "@/components/checkout/address-selector"
import CheckoutSummary from "@/components/checkout/checkout-summary"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
    const router = useRouter()
    const { items, clearCart } = useCartStore()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
    const [addresses, setAddresses] = useState<any[]>([])
    const [selectedAddress, setSelectedAddress] = useState<AddressFormData | null>(null)
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchAddresses()
    }, [])

    const fetchAddresses = async () => {
        try {
            const response = await fetch("/api/user/addresses")
            if (response.ok) {
                const data = await response.json()
                setAddresses(data)

                // If there are addresses and no manual form shown, select the default one
                if (data.length > 0) {
                    const defaultAddress = data.find((a: any) => a.isDefault) || data[0]
                    handleSelectAddress(defaultAddress)
                } else {
                    setShowForm(true)
                }
            } else {
                setShowForm(true)
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error)
            setShowForm(true)
        } finally {
            setIsLoadingAddresses(false)
        }
    }

    const handleSelectAddress = (address: any) => {
        const formData: AddressFormData = {
            fullName: `${address.firstName} ${address.lastName}`,
            phone: address.phone,
            email: "", // User will need to provide or we can fetch from session
            address: address.address,
            city: address.city,
            district: address.district,
            zipCode: address.postalCode || "",
        }

        // Try to get email from session if possible
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.user?.email) {
                    formData.email = data.user.email
                    setSelectedAddress({ ...formData })
                }
            })
            .catch(() => {
                setSelectedAddress(formData)
            })

        setSelectedAddressId(address.id)
        setShowForm(true) // We show the form pre-filled
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-md text-center">
                    <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-24 w-24" />
                    <h1 className="mb-2 text-2xl font-bold">Sepetiniz Boş</h1>
                    <p className="text-muted-foreground mb-6">
                        Ödeme yapabilmek için sepetinize ürün eklemelisiniz
                    </p>
                    <Button asChild>
                        <Link href="/products">Alışverişe Başla</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const [couponCode, setCouponCode] = useState<string | null>(null)
    const [discountAmount, setDiscountAmount] = useState(0)

    const handleApplyCoupon = async (code: string): Promise<boolean> => {
        try {
            // Validate coupon with backend
            const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

            const res = await fetch("/api/checkout/coupon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, cartTotal: total }),
            })

            const data = await res.json()

            if (res.ok && data.valid) {
                setCouponCode(data.code)
                setDiscountAmount(data.discountAmount)
                return true
            } else {
                setError(data.error || "Geçersiz kupon")
                setTimeout(() => setError(""), 3000)
                return false
            }
        } catch (error) {
            setError("Kupon doğrulanamadı")
            return false
        }
    }

    const handleRemoveCoupon = () => {
        setCouponCode(null)
        setDiscountAmount(0)
    }

    const handleAddressSubmit = async (addressData: AddressFormData) => {
        try {
            setIsProcessing(true)
            setError("")

            const checkoutData = {
                cartItems: items,
                shippingAddress: addressData,
                billingAddress: addressData,
                couponCode: couponCode, // Send coupon code to backend
            }

            const response = await fetch("/api/checkout/initialize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(checkoutData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Ödeme başlatılamadı")
            }

            clearCart()

            if (result.paymentPageUrl) {
                window.location.href = result.paymentPageUrl
            } else if (result.checkoutFormContent) {
                router.push(`/orders/${result.orderId}?status=pending`)
            } else {
                router.push(`/orders/${result.orderId}?status=success`)
            }
        } catch (err: any) {
            console.error("Checkout error:", err)
            setError(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Ödeme</h1>

            {error && (
                <div className="bg-destructive/15 text-destructive mb-6 rounded-md px-4 py-3">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {isLoadingAddresses ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {addresses.length > 0 && (
                                <AddressSelector
                                    addresses={addresses}
                                    selectedAddressId={selectedAddressId}
                                    onSelect={handleSelectAddress}
                                    onAddNew={() => {
                                        setSelectedAddressId(null)
                                        setSelectedAddress({
                                            fullName: "",
                                            phone: "",
                                            email: "",
                                            address: "",
                                            city: "",
                                            district: "",
                                            zipCode: "",
                                        })
                                        // Fetch email again for new address
                                        fetch("/api/auth/me")
                                            .then((res) => res.json())
                                            .then((data) => {
                                                if (data.user?.email) {
                                                    setSelectedAddress((prev) => ({
                                                        ...prev!,
                                                        email: data.user.email,
                                                    }))
                                                }
                                            })
                                    }}
                                />
                            )}

                            {showForm && (
                                <AddressForm
                                    onSubmit={handleAddressSubmit}
                                    isLoading={isProcessing}
                                    defaultValues={selectedAddress || undefined}
                                />
                            )}
                        </>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <CheckoutSummary
                        discount={discountAmount}
                        couponCode={couponCode}
                        onApplyCoupon={handleApplyCoupon}
                        onRemoveCoupon={handleRemoveCoupon}
                    />
                </div>
            </div>
        </div>
    )
}
