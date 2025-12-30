import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Get all active products
    const products = await prisma.product.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
        where: {
            status: "PUBLISHED",
        },
    })

    // Get all categories
    const categories = await prisma.category.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
    })

    // Generate product URLs
    const productUrls = products.map((product: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
    }))

    // Generate category URLs
    const categoryUrls = categories.map((category: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
    }))

    // Static routes
    const staticRoutes = [
        "",
        "/contact",
        "/faq",
        "/products",
        "/categories",
        "/shipping",
        "/returns",
        "/privacy",
        "/terms",
        "/cookies",
        "/kvkk",
        "/login",
        "/register",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1.0 : 0.5,
    }))

    return [...staticRoutes, ...productUrls, ...categoryUrls]
}
