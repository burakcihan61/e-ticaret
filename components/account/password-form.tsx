"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { passwordChangeSchema, type PasswordChangeInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function PasswordForm() {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PasswordChangeInput>({
        resolver: zodResolver(passwordChangeSchema),
    })

    const onSubmit = async (data: PasswordChangeInput) => {
        try {
            setIsLoading(true)

            const response = await fetch("/api/user/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error(result.error || "Şifre değiştirilemedi")
                return
            }

            toast.success("Şifreniz başarıyla değiştirildi")
            reset()
        } catch (err) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Şifre İşlemleri</CardTitle>
                <CardDescription>
                    Güvenliğiniz için düzenli olarak şifrenizi değiştirmenizi öneririz.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                {...register("currentPassword")}
                            />
                            {errors.currentPassword && (
                                <p className="text-destructive text-sm">
                                    {errors.currentPassword.message}
                                </p>
                            )}
                        </div>
                        <div className="col-span-1 md:hidden"></div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Yeni Şifre</Label>
                            <Input id="newPassword" type="password" {...register("newPassword")} />
                            {errors.newPassword && (
                                <p className="text-destructive text-sm">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <p className="text-destructive text-sm">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant="outline" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Şifreyi Değiştir
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
