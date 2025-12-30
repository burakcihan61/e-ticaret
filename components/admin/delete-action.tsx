"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DeleteActionProps {
    id: string
    resourceType: "products" | "categories"
    resourceName: string
    triggerAsMenuItem?: boolean
}

export default function DeleteAction({
    id,
    resourceType,
    resourceName,
    triggerAsMenuItem = true,
}: DeleteActionProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/admin/${resourceType}/${id}`, {
                method: "DELETE",
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Silme işlemi başarısız")
            }

            toast.success("Başarıyla silindi")
            router.refresh()
            setIsOpen(false)
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    const trigger = triggerAsMenuItem ? (
        <DropdownMenuItem
            className="text-destructive flex cursor-pointer items-center"
            onSelect={(e) => {
                e.preventDefault()
                setIsOpen(true)
            }}
        >
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
        </DropdownMenuItem>
    ) : (
        <AlertDialogTrigger asChild>
            <button className="text-destructive hover:bg-muted flex items-center gap-2 rounded-md p-2">
                <Trash2 className="h-4 w-4" />
                Sil
            </button>
        </AlertDialogTrigger>
    )

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <strong>{resourceName}</strong> adlı{" "}
                        {resourceType === "products" ? "ürünü" : "kategoriyi"} silmek üzeresiniz. Bu
                        işlem geri alınamaz.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>İptal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sil
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
