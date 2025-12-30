"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const addressSchema = z.object({
    fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
    city: z.string().min(2, "Şehir seçiniz"),
    district: z.string().min(2, "İlçe giriniz"),
    zipCode: z.string().optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormProps {
    onSubmit: (data: AddressFormData) => void
    defaultValues?: Partial<AddressFormData>
    isLoading?: boolean
    buttonText?: string
}

export default function AddressForm({
    onSubmit,
    defaultValues,
    isLoading,
    buttonText,
}: AddressFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues,
    })

    // Update form when defaultValues changes (e.g. from address selector)
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const cities = [
        "İstanbul",
        "Ankara",
        "İzmir",
        "Bursa",
        "Antalya",
        "Adana",
        "Konya",
        "Gaziantep",
        "Mersin",
        "Kayseri",
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Teslimat Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Ad Soyad *</Label>
                            <Input
                                id="fullName"
                                placeholder="Adınız Soyadınız"
                                {...register("fullName")}
                            />
                            {errors.fullName && (
                                <p className="text-destructive text-sm">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="05XX XXX XX XX"
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <p className="text-destructive text-sm">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
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
                        <Label htmlFor="address">Adres *</Label>
                        <Textarea
                            id="address"
                            placeholder="Mahalle, sokak, bina no, daire no"
                            rows={3}
                            {...register("address")}
                        />
                        {errors.address && (
                            <p className="text-destructive text-sm">{errors.address.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="city">Şehir *</Label>
                            <select
                                id="city"
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register("city")}
                            >
                                <option value="">Şehir Seçiniz</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            {errors.city && (
                                <p className="text-destructive text-sm">{errors.city.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="district">İlçe *</Label>
                            <Input id="district" placeholder="İlçe" {...register("district")} />
                            {errors.district && (
                                <p className="text-destructive text-sm">
                                    {errors.district.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zipCode">Posta Kodu</Label>
                            <Input id="zipCode" placeholder="34000" {...register("zipCode")} />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "İşleniyor..." : buttonText || "Devam Et"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
