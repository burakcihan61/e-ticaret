import { z } from "zod"

// Auth validations
export const registerSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır").max(100, "Şifre çok uzun"),
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır").optional(),
})

export const loginSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(1, "Şifre gereklidir"),
})

// Address validations
export const addressSchema = z.object({
    title: z.string().min(1, "Adres başlığı gereklidir"),
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
    city: z.string().min(2, "Şehir gereklidir"),
    district: z.string().min(2, "İlçe gereklidir"),
    postalCode: z.string().optional(),
    country: z.string().default("Türkiye"),
    isDefault: z.boolean().default(false),
})

// Product validations
export const productSchema = z.object({
    name: z.string().min(3, "Ürün adı en az 3 karakter olmalıdır"),
    slug: z.string().min(3, "Slug en az 3 karakter olmalıdır"),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    sku: z.string().min(1, "SKU gereklidir"),
    price: z.number().positive("Fiyat pozitif olmalıdır"),
    comparePrice: z.number().positive().optional(),
    stock: z.number().int().min(0, "Stok negatif olamaz"),
    categoryId: z.string().min(1, "Kategori gereklidir"),
    brandId: z.string().optional(),
    images: z.array(z.string()).min(1, "En az bir resim gereklidir"),
    status: z.enum(["DRAFT", "PUBLISHED", "OUT_OF_STOCK", "DISCONTINUED"]),
    isFeatured: z.boolean().default(false),
    isNew: z.boolean().default(false),
})

// Category validations
export const categorySchema = z.object({
    name: z.string().min(2, "Kategori adı en az 2 karakter olmalıdır"),
    slug: z.string().min(2, "Slug en az 2 karakter olmalıdır"),
    description: z.string().optional(),
    image: z.string().optional(),
    parentId: z.string().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
})

// Review validations
export const reviewSchema = z.object({
    productId: z.string().min(1, "Ürün ID gereklidir"),
    rating: z.number().int().min(1, "Minimum 1 yıldız").max(5, "Maksimum 5 yıldız"),
    title: z.string().optional(),
    comment: z.string().optional(),
    images: z.array(z.string()).optional(),
})

// Contact validations
export const contactSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    phone: z.string().optional(),
    subject: z.string().min(3, "Konu en az 3 karakter olmalıdır"),
    message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
})

// Newsletter validation
export const newsletterSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
})

// Profile validations
export const profileUpdateSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır").optional(),
    phone: z
        .string()
        .regex(/^(\+90|0)?[0-9]{10}$/, "Geçerli bir telefon numarası giriniz (örn: 0555 555 55 55)")
        .optional()
        .or(z.literal("")),
})

export const passwordChangeSchema = z
    .object({
        currentPassword: z.string().min(1, "Mevcut şifreniz gereklidir"),
        newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır"),
        confirmPassword: z.string().min(1, "Şifre onayı gereklidir"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Şifreler eşleşmiyor",
        path: ["confirmPassword"],
    })

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>
