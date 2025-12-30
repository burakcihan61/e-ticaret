"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Image as ImageIcon } from "lucide-react"

const categorySchema = z.object({
    name: z.string().min(1, "İsim gereklidir"),
    slug: z.string().min(1, "Slug gereklidir"),
    description: z.string().optional().nullable(),
    parentId: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormProps {
    initialData?: any
    categories: any[]
}

export default function CategoryForm({ initialData, categories }: CategoryFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData
            ? {
                  name: initialData.name,
                  slug: initialData.slug,
                  description: initialData.description,
                  parentId: initialData.parentId,
                  image: initialData.image,
              }
            : {
                  parentId: null,
              },
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setIsLoading(true)
            const url = initialData
                ? `/api/admin/categories/${initialData.id}`
                : "/api/admin/categories"
            const method = initialData ? "PATCH" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "İşlem başarısız")
            }

            toast.success(initialData ? "Kategori güncellendi" : "Kategori oluşturuldu")
            router.push("/admin/categories")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {initialData ? "Kategoriyi Düzenle" : "Yeni Kategori Oluştur"}
                    </h1>
                    <p className="text-muted-foreground">
                        {initialData
                            ? `${initialData.name} kategorisini güncelleyin.`
                            : "Yeni bir ürün kategorisi ekleyin."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        İptal
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Değişiklikleri Kaydet" : "Kategoriyi Oluştur"}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kategori Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Kategori Adı</Label>
                            <Input
                                id="name"
                                placeholder="Elektronik, Giyim vb."
                                {...register("name")}
                                onChange={(e) => {
                                    register("name").onChange(e)
                                    if (!initialData) {
                                        setValue(
                                            "slug",
                                            e.target.value
                                                .toLowerCase()
                                                .replace(/ /g, "-")
                                                .replace(/[^\w-]+/g, "")
                                        )
                                    }
                                }}
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" placeholder="elektronik" {...register("slug")} />
                            {errors.slug && (
                                <p className="text-destructive text-sm">{errors.slug.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parentId">Üst Kategori (Opsiyonel)</Label>
                        <Select
                            onValueChange={(value) =>
                                setValue("parentId", value === "none" ? null : value)
                            }
                            defaultValue={initialData?.parentId || "none"}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Üst kategori seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Yok (Ana Kategori)</SelectItem>
                                {categories
                                    .filter((c) => c.id !== initialData?.id) // Prevent selecting self as parent
                                    .map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Kategori Görseli (URL)</Label>
                        <Input id="image" placeholder="https://..." {...register("image")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            placeholder="Kategori hakkında kısa bilgi..."
                            {...register("description")}
                        />
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
