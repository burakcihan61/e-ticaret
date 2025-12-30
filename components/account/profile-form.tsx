"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
    user: {
        name: string | null
        email: string
        phone: string | null
    }
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<ProfileUpdateInput>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            name: user.name || "",
            phone: user.phone || "",
        },
    })

    const onSubmit = async (data: ProfileUpdateInput) => {
        try {
            setIsLoading(true)

            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error(result.error || "Güncelleme başarısız")
                return
            }

            toast.success("Profil güncellendi")
            router.refresh()
        } catch (err) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Genel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ad Soyad</Label>
                            <Input id="name" placeholder="Ad Soyad" {...register("name")} />
                            {errors.name && (
                                <p className="text-destructive text-sm">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta Adresi</Label>
                            <Input
                                id="email"
                                value={user.email}
                                disabled
                                className="bg-muted opacity-80"
                                title="E-posta adresi değiştirilemez"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon Numarası</Label>
                            <Input id="phone" placeholder="05xx xxx xx xx" {...register("phone")} />
                            {errors.phone && (
                                <p className="text-destructive text-sm">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading || !isDirty}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Güncelle
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
