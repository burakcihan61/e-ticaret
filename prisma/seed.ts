import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { hashPassword } from "../lib/auth"
import { env } from "prisma/config"

const adapter = new PrismaPg({
    connectionString: env("DATABASE_URL"),
})

const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("🌱 Seeding database...")

    // Create admin user
    const adminPassword = await hashPassword("admin123456")
    const admin = await prisma.user.upsert({
        where: { email: "admin@eticaret.com" },
        update: {},
        create: {
            email: "admin@eticaret.com",
            password: adminPassword,
            name: "Admin User",
            role: "SUPER_ADMIN",
            status: "ACTIVE",
            emailVerified: new Date(),
        },
    })
    console.log("✅ Admin user created:", admin.email)

    // Create test user
    const userPassword = await hashPassword("user123456")
    const user = await prisma.user.upsert({
        where: { email: "user@test.com" },
        update: {},
        create: {
            email: "user@test.com",
            password: userPassword,
            name: "Test User",
            role: "USER",
            status: "ACTIVE",
            emailVerified: new Date(),
        },
    })
    console.log("✅ Test user created:", user.email)

    // Create brands
    const brands = await Promise.all([
        prisma.brand.upsert({
            where: { slug: "apple" },
            update: {},
            create: {
                name: "Apple",
                slug: "apple",
                description: "Premium teknoloji ürünleri",
                isActive: true,
            },
        }),
        prisma.brand.upsert({
            where: { slug: "samsung" },
            update: {},
            create: {
                name: "Samsung",
                slug: "samsung",
                description: "Yenilikçi elektronik ürünler",
                isActive: true,
            },
        }),
        prisma.brand.upsert({
            where: { slug: "nike" },
            update: {},
            create: {
                name: "Nike",
                slug: "nike",
                description: "Spor giyim ve ayakkabı",
                isActive: true,
            },
        }),
    ])
    console.log(`✅ Created ${brands.length} brands`)

    // Create categories
    const elektronik = await prisma.category.upsert({
        where: { slug: "elektronik" },
        update: {},
        create: {
            name: "Elektronik",
            slug: "elektronik",
            description: "Elektronik ürünler ve aksesuarlar",
            isActive: true,
            isFeatured: true,
            order: 1,
        },
    })

    const telefon = await prisma.category.upsert({
        where: { slug: "telefon" },
        update: {},
        create: {
            name: "Telefon",
            slug: "telefon",
            description: "Akıllı telefonlar",
            parentId: elektronik.id,
            isActive: true,
            order: 1,
        },
    })

    const giyim = await prisma.category.upsert({
        where: { slug: "giyim" },
        update: {},
        create: {
            name: "Giyim",
            slug: "giyim",
            description: "Erkek ve kadın giyim",
            isActive: true,
            isFeatured: true,
            order: 2,
        },
    })

    const ayakkabi = await prisma.category.upsert({
        where: { slug: "ayakkabi" },
        update: {},
        create: {
            name: "Ayakkabı",
            slug: "ayakkabi",
            description: "Spor ve günlük ayakkabılar",
            parentId: giyim.id,
            isActive: true,
            order: 1,
        },
    })

    console.log("✅ Created categories")

    // Create products
    const products = [
        {
            name: "iPhone 15 Pro",
            slug: "iphone-15-pro",
            description: "A17 Pro çip, Titanyum tasarım, ProMotion ekran. En gelişmiş iPhone.",
            shortDescription: "Apple'ın en güçlü telefonu",
            sku: "APL-IP15P-128",
            price: 54999,
            comparePrice: 59999,
            stock: 50,
            categoryId: telefon.id,
            brandId: brands[0].id,
            status: "PUBLISHED" as const,
            isFeatured: true,
            isNew: true,
            images: [
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
                "https://images.unsplash.com/photo-1695048133082-4a5d4d8c4f1e?w=800&q=80",
            ],
        },
        {
            name: "Samsung Galaxy S24 Ultra",
            slug: "samsung-galaxy-s24-ultra",
            description: "200MP kamera, S Pen desteği, 5000mAh batarya. Galaxy serisinin zirvesi.",
            shortDescription: "Samsung'un amiral gemisi",
            sku: "SAM-S24U-256",
            price: 49999,
            comparePrice: 54999,
            stock: 35,
            categoryId: telefon.id,
            brandId: brands[1].id,
            status: "PUBLISHED" as const,
            isFeatured: true,
            isNew: true,
            images: [
                "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
            ],
        },
        {
            name: "Nike Air Max 270",
            slug: "nike-air-max-270",
            description: "Maksimum hava yastığı konforu. Günlük kullanım için ideal spor ayakkabı.",
            shortDescription: "Konforlu spor ayakkabı",
            sku: "NIK-AM270-42",
            price: 3499,
            comparePrice: 3999,
            stock: 100,
            categoryId: ayakkabi.id,
            brandId: brands[2].id,
            status: "PUBLISHED" as const,
            isFeatured: true,
            images: [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
            ],
        },
        {
            name: "Nike Dri-FIT Tişört",
            slug: "nike-dri-fit-tisort",
            description: "Nefes alabilen kumaş, ter emici teknoloji. Spor için ideal.",
            shortDescription: "Spor tişört",
            sku: "NIK-DFIT-L",
            price: 599,
            stock: 200,
            categoryId: giyim.id,
            brandId: brands[2].id,
            status: "PUBLISHED" as const,
            images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
        },
    ]

    for (const productData of products) {
        await prisma.product.upsert({
            where: { slug: productData.slug },
            update: {
                name: productData.name,
                description: productData.description,
                shortDescription: productData.shortDescription,
                price: productData.price,
                comparePrice: productData.comparePrice,
                stock: productData.stock,
                images: productData.images,
                status: productData.status,
                isFeatured: productData.isFeatured,
            },
            create: productData,
        })
    }
    console.log(`✅ Created ${products.length} products`)

    // Create banners
    const banners = [
        {
            id: "banner-1",
            title: "Yeni Sezon İndirimleri",
            subtitle: "Tüm ürünlerde %50'ye varan indirimler",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
            link: "/products",
            buttonText: "Alışverişe Başla",
            order: 1,
            isActive: true,
        },
        {
            id: "banner-2",
            title: "Akıllı Telefonlarda Fırsat",
            subtitle: "En yeni iPhone ve Galaxy modelleri şimdi satışta",
            image: "https://images.unsplash.com/photo-1556656793-062ff987b50c?w=1600&q=80",
            link: "/categories/telefon",
            buttonText: "Modelleri İncele",
            order: 2,
            isActive: true,
        },
        {
            id: "banner-3",
            title: "Trend Ayakkabılar",
            subtitle: "Nike, Adidas ve daha fazlası en uygun fiyatlarla",
            image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1600&q=80",
            link: "/categories/ayakkabi",
            buttonText: "Hemen Keşfet",
            order: 3,
            isActive: true,
        },
    ]

    for (const bannerData of banners) {
        await prisma.banner.upsert({
            where: { id: bannerData.id },
            update: bannerData,
            create: bannerData,
        })
    }
    console.log(`✅ Created ${banners.length} banners`)

    // Create shipping zone
    await prisma.shippingZone.upsert({
        where: { id: "zone-tr" },
        update: {},
        create: {
            id: "zone-tr",
            name: "Türkiye",
            countries: ["Türkiye"],
            cost: 29.99,
            freeShippingThreshold: 500,
            estimatedDays: "2-3 gün",
            isActive: true,
        },
    })
    console.log("✅ Created shipping zones")

    // Create tax rate
    await prisma.taxRate.upsert({
        where: { id: "tax-tr" },
        update: {},
        create: {
            id: "tax-tr",
            country: "Türkiye",
            rate: 20,
            isDefault: true,
        },
    })
    console.log("✅ Created tax rates")

    console.log("✨ Seeding completed!")
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
