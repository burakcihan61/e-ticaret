import Link from "next/link"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ShoppingBag, Shield, Truck, HeadphonesIcon } from "lucide-react"
import prisma from "@/lib/prisma"
import BannerSlider from "@/components/shop/banner-slider"

export default async function HomePage() {
    const session = await getSession()

    // Fetch active banners sorted by order
    const banners = await prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    })

    const categories = await prisma.category.findMany({
        take: 8,
        include: {
            _count: {
                select: { products: true },
            },
        },
        orderBy: {
            products: {
                _count: "desc",
            },
        },
    })

    const features = [
        {
            icon: ShoppingBag,
            title: "Geniş Ürün Yelpazesi",
            description: "Binlerce ürün arasından seçim yapın",
        },
        {
            icon: Shield,
            title: "Güvenli Alışveriş",
            description: "SSL sertifikası ile korumalı ödeme",
        },
        {
            icon: Truck,
            title: "Hızlı Kargo",
            description: "2-3 iş günü içinde kapınızda",
        },
        {
            icon: HeadphonesIcon,
            title: "7/24 Destek",
            description: "Müşteri hizmetlerimiz her zaman yanınızda",
        },
    ]

    return (
        <div className="flex flex-col">
            {/* Dynamic Hero Banner Slider */}
            <BannerSlider banners={banners} />

            {/* Features Section */}
            <section className="bg-muted/40 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <Card key={index} className="bg-background border-none shadow-none">
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center space-y-3 text-center">
                                            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                                <Icon className="text-primary h-6 w-6" />
                                            </div>
                                            <h3 className="font-semibold">{feature.title}</h3>
                                            <p className="text-muted-foreground text-sm">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Kategoriler</h2>
                            <p className="text-muted-foreground mt-2">
                                Popüler kategorilere göz atın
                            </p>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/categories">
                                Tümünü Gör
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    {categories.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {categories.map((category: any) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group"
                                >
                                    <Card className="overflow-hidden transition-all hover:shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="bg-muted mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <ShoppingBag className="text-muted-foreground group-hover:text-primary h-12 w-12 transition-colors" />
                                                )}
                                            </div>
                                            <h3 className="text-center font-semibold">
                                                {category.name}
                                            </h3>
                                            <p className="text-muted-foreground mt-1 text-center text-xs">
                                                {category._count.products} Ürün
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-muted/20 rounded-lg py-10 text-center">
                            <p className="text-muted-foreground">Henüz kategori eklenmemiş.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold">Kampanyalardan Haberdar Olun</h2>
                    <p className="mb-8 text-lg opacity-90">
                        E-bültenimize abone olun, özel indirimlerden ilk siz haberdar olun
                    </p>
                    <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className="text-foreground flex-1 rounded-md px-4 py-2"
                        />
                        <Button variant="secondary" size="lg">
                            Abone Ol
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
