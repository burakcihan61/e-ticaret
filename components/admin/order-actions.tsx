"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface OrderActionsProps {
    orderId: string
    currentStatus: string
}

export default function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const updateStatus = async (status: string, note: string) => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, note }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Güncelleme başarısız")
            }

            toast.success(`Sipariş durumu ${status} olarak güncellendi`)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <DropdownMenuItem
                className="flex cursor-pointer items-center text-blue-600"
                disabled={
                    isLoading ||
                    currentStatus === "PAID" ||
                    currentStatus === "SHIPPED" ||
                    currentStatus === "DELIVERED"
                }
                onClick={() => updateStatus("PAID", "Sipariş manuel olarak onaylandı.")}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Onayla (Ödendi)
            </DropdownMenuItem>

            <DropdownMenuItem
                className="text-destructive flex cursor-pointer items-center"
                disabled={
                    isLoading || currentStatus === "CANCELLED" || currentStatus === "DELIVERED"
                }
                onClick={() =>
                    updateStatus("CANCELLED", "Sipariş yönetici tarafından iptal edildi.")
                }
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                )}
                İptal Et
            </DropdownMenuItem>
        </>
    )
}
