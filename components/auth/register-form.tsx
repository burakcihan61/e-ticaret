"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

import { toast } from "sonner"

export default function RegisterForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterInput) => {
        try {
            setIsLoading(true)

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error(result.error || "Kayıt başarısız", {
                    description: "Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
                })
                return
            }

            toast.success("Kayıt başarılı", {
                description: "Hesabınız oluşturuldu, yönlendiriliyorsunuz...",
            })

            router.push("/")
            router.refresh()
        } catch (err) {
            toast.error("Bir hata oluştu", {
                description: "Sunucuya bağlanılamadı.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Kayıt Ol</CardTitle>
                <CardDescription>Yeni hesap oluşturun</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">İsim (Opsiyonel)</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Adınız Soyadınız"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-destructive text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ornek@email.com"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-destructive text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-destructive text-sm">{errors.password.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                    </Button>
                    <p className="text-muted-foreground text-center text-sm">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Giriş Yap
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
