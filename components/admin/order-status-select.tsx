"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

interface OrderStatusSelectProps {
    orderId: string
    currentStatus: string
}

const statuses = [
    { value: "PENDING", label: "Bekliyor" },
    { value: "PROCESSING", label: "İşleniyor" },
    { value: "SHIPPED", label: "Kargoya Verildi" },
    { value: "DELIVERED", label: "Teslim Edildi" },
    { value: "CANCELLED", label: "İptal Edildi" },
    { value: "REFUNDED", label: "İade Edildi" },
]

export default function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
    const router = useRouter()
    const [status, setStatus] = useState(currentStatus)
    const [isLoading, setIsLoading] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    const handleUpdate = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Güncelleme başarısız")
            }

            toast.success("Sipariş durumu güncellendi")
            setHasChanges(false)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Select
                value={status}
                onValueChange={(val) => {
                    setStatus(val)
                    setHasChanges(val !== currentStatus)
                }}
                disabled={isLoading}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Durum Seçin" />
                </SelectTrigger>
                <SelectContent>
                    {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                            {s.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={handleUpdate} disabled={!hasChanges || isLoading} size="sm">
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Kaydet
                    </>
                )}
            </Button>
        </div>
    )
}
