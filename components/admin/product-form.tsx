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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react"

const productSchema = z.object({
    name: z.string().min(1, "İsim gereklidir"),
    slug: z.string().min(1, "Slug gereklidir"),
    description: z.string().optional(),
    sku: z.string().min(1, "SKU gereklidir"),
    price: z.coerce.number().min(0, "Fiyat 0'dan küçük olamaz"),
    comparePrice: z.coerce.number().optional(),
    stock: z.coerce.number().min(0, "Stok 0'dan küçük olamaz"),
    status: z.enum(["DRAFT", "PUBLISHED", "OUT_OF_STOCK", "DISCONTINUED"]),
    categoryId: z.string().min(1, "Kategori seçilmelidir"),
    images: z.array(z.string()).min(1, "En az bir resim eklenmelidir"),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
    initialData?: any
    categories: any[]
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState<string[]>(initialData?.images || [])
    const [newImageUrl, setNewImageUrl] = useState("")

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  price: Number(initialData.price),
                  comparePrice: initialData.comparePrice
                      ? Number(initialData.comparePrice)
                      : undefined,
                  stock: Number(initialData.stock),
              }
            : {
                  status: "DRAFT",
                  images: [],
              },
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setIsLoading(true)
            const url = initialData
                ? `/api/admin/products/${initialData.id}`
                : "/api/admin/products"
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

            toast.success(initialData ? "Ürün güncellendi" : "Ürün oluşturuldu")
            router.push("/admin/products")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    const addImage = () => {
        if (!newImageUrl) return
        const updatedImages = [...images, newImageUrl]
        setImages(updatedImages)
        setValue("images", updatedImages, { shouldValidate: true })
        setNewImageUrl("")
    }

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)
        setValue("images", updatedImages, { shouldValidate: true })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {initialData ? "Ürünü Düzenle" : "Yeni Ürün Oluştur"}
                    </h1>
                    <p className="text-muted-foreground">
                        {initialData
                            ? `${initialData.name} ürününü güncelleyin.`
                            : "Mağazanıza yeni bir ürün ekleyin."}
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
                        {initialData ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Temel Bilgiler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Ürün Adı</Label>
                                    <Input
                                        id="name"
                                        placeholder="Kırmızı Pamuklu Tişört"
                                        {...register("name")}
                                        onChange={(e) => {
                                            register("name").onChange(e)
                                            // Auto-generate slug if it's a new product
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
                                        <p className="text-destructive text-sm">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        placeholder="kirmizi-pamuklu-tisort"
                                        {...register("slug")}
                                    />
                                    {errors.slug && (
                                        <p className="text-destructive text-sm">
                                            {errors.slug.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Açıklama</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ürün detayları ve özellikleri..."
                                    className="min-h-[150px]"
                                    {...register("description")}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input id="sku" placeholder="KPM-TS-001" {...register("sku")} />
                                    {errors.sku && (
                                        <p className="text-destructive text-sm">
                                            {errors.sku.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId">Kategori</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setValue("categoryId", value, { shouldValidate: true })
                                        }
                                        defaultValue={initialData?.categoryId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kategori seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.categoryId && (
                                        <p className="text-destructive text-sm">
                                            {errors.categoryId.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fiyat ve Stok</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Satış Fiyatı (TL)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        {...register("price")}
                                    />
                                    {errors.price && (
                                        <p className="text-destructive text-sm">
                                            {errors.price.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="comparePrice">
                                        İndirimsiz Fiyat (Opsiyonel)
                                    </Label>
                                    <Input
                                        id="comparePrice"
                                        type="number"
                                        step="0.01"
                                        {...register("comparePrice")}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stok Miktarı</Label>
                                    <Input id="stock" type="number" {...register("stock")} />
                                    {errors.stock && (
                                        <p className="text-destructive text-sm">
                                            {errors.stock.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Stok Durumu</Label>
                                    <Select
                                        onValueChange={(value: any) =>
                                            setValue("status", value, { shouldValidate: true })
                                        }
                                        defaultValue={initialData?.status || "DRAFT"}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Durum seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DRAFT">Taslak</SelectItem>
                                            <SelectItem value="PUBLISHED">Yayında</SelectItem>
                                            <SelectItem value="OUT_OF_STOCK">Stokta Yok</SelectItem>
                                            <SelectItem value="DISCONTINUED">
                                                Satıştan Kaldırıldı
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ürün Resimleri</CardTitle>
                            <CardDescription>Resim URL'lerini ekleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://..."
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            addImage()
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={addImage}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {errors.images && (
                                <p className="text-destructive text-sm">{errors.images.message}</p>
                            )}

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {images.map((url, index) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-square overflow-hidden rounded-md border"
                                    >
                                        <img
                                            src={url}
                                            alt={`Ürün ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="bg-destructive text-destructive-foreground absolute right-1 top-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                        {index === 0 && (
                                            <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[10px] text-white">
                                                Ana Görsel
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {images.length === 0 && (
                                    <div className="bg-muted/50 text-muted-foreground col-span-2 flex aspect-square flex-col items-center justify-center rounded-md border-2 border-dashed">
                                        <ImageIcon className="mb-2 h-8 w-8" />
                                        <p className="text-xs">Resim yok</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
