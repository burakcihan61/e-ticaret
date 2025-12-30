"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations"
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

export default function LoginForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginInput) => {
        try {
            setIsLoading(true)

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error(result.error || "Giriş başarısız", {
                    description: "Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
                })
                return
            }

            toast.success("Giriş başarılı", {
                description: "Mağazaya hoş geldiniz!",
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
                <CardTitle>Giriş Yap</CardTitle>
                <CardDescription>Hesabınıza giriş yapın</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
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
                        {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </Button>
                    <p className="text-muted-foreground text-center text-sm">
                        Hesabınız yok mu?{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            Kayıt Ol
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
