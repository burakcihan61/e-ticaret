import Link from "next/link"
import prisma from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        where: {
            parentId: null, // Only show top-level categories
        },
        include: {
            _count: {
                select: { products: true, children: true },
            },
        },
        orderBy: {
            name: "asc",
        },
    })

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="mb-4 text-center text-4xl font-bold tracking-tight">
                    Tüm Kategoriler
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-center">
                    İhtiyacınız olan ürünleri kategori bazlı kolayca bulun. Mağazamızdaki tüm ürün
                    gruplarını buradan inceleyebilirsiniz.
                </p>
            </div>

            {categories.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group"
                        >
                            <Card className="hover:border-primary/50 h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
                                <CardContent className="p-0">
                                    <div className="bg-muted relative flex aspect-[4/3] items-center justify-center overflow-hidden">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <ShoppingBag className="text-muted-foreground/40 group-hover:text-primary h-16 w-16 transition-colors duration-300" />
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                                            <span className="translate-y-4 transform rounded-full bg-white px-4 py-2 font-medium text-black transition-transform duration-300 group-hover:translate-y-0">
                                                İncele
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 text-center">
                                        <h2 className="group-hover:text-primary mb-2 text-xl font-bold transition-colors">
                                            {category.name}
                                        </h2>
                                        <div className="text-muted-foreground flex items-center justify-center gap-4 text-sm">
                                            <span className="bg-primary/5 text-primary rounded-full px-3 py-1 font-medium">
                                                {category._count.products} Ürün
                                            </span>
                                            {category._count.children > 0 && (
                                                <span className="bg-secondary/10 text-secondary-foreground rounded-full px-3 py-1">
                                                    {category._count.children} Alt Kategori
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-muted/30 rounded-2xl border-2 border-dashed py-20 text-center">
                    <ShoppingBag className="text-muted-foreground/30 mx-auto mb-6 h-20 w-20" />
                    <h2 className="text-muted-foreground text-2xl font-bold">
                        Henüz kategori bulunmuyor
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-2 max-w-sm">
                        Mağazamız şu anda düzenleniyor. Lütfen daha sonra tekrar kontrol edin.
                    </p>
                </div>
            )}
        </div>
    )
}
