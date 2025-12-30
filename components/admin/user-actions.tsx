"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Shield, Lock, Unlock, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"

interface User {
    id: string
    name: string | null
    email: string | null
    role: string
    status: string
}

interface UserActionsProps {
    user: User
}

export default function UserActions({ user }: UserActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const onUpdate = async (data: { role?: string; status?: string }) => {
        try {
            setIsLoading(true)
            await axios.patch(`/api/admin/users/${user.id}`, data)
            toast.success("Kullanıcı başarıyla güncellendi")
            router.refresh()
        } catch (error: any) {
            const message = error.response?.data || "Bir hata oluştu"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleRole = () => {
        const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN"
        onUpdate({ role: nextRole })
    }

    const toggleStatus = () => {
        const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
        onUpdate({ status: nextStatus })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <MoreHorizontal className="h-4 w-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link
                        href={`/admin/users/${user.id}`}
                        className="flex w-full cursor-pointer items-center"
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Detayları Gör
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex cursor-pointer items-center" onClick={toggleRole}>
                    <Shield className="mr-2 h-4 w-4" />
                    {user.role === "ADMIN" ? "Kullanıcı Yap" : "Yönetici Yap"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className={cn(
                        "flex cursor-pointer items-center",
                        user.status === "ACTIVE" ? "text-destructive" : "text-emerald-600"
                    )}
                    onClick={toggleStatus}
                >
                    {user.status === "ACTIVE" ? (
                        <>
                            <Lock className="mr-2 h-4 w-4" />
                            Hesabı Askıya Al
                        </>
                    ) : (
                        <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Hesabı Aktif Et
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Minimal cn implementation to avoid import issues if not available
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}
