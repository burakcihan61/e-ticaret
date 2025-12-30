import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Package,
    ShoppingBag,
    Star,
    Shield,
    Lock,
    Unlock,
    ArrowLeft,
    Clock,
    CreditCard,
} from "lucide-react"
import Link from "next/link"
import { formatPrice, formatDate } from "@/lib/utils"
import UserActions from "@/components/admin/user-actions"

interface AdminUserDetailPageProps {
    params: {
        id: string
    }
}

async function getUserData(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            addresses: {
                orderBy: { isDefault: "desc" },
            },
            orders: {
                orderBy: { createdAt: "desc" },
                take: 10,
                include: {
                    items: true,
                },
            },
            reviews: {
                orderBy: { createdAt: "desc" },
                include: {
                    product: {
                        select: { name: true, images: true },
                    },
                },
            },
            _count: {
                select: { orders: true, reviews: true, addresses: true },
            },
        },
    })

    if (!user) return null

    // Calculate stats
    const totalSpent = await prisma.order.aggregate({
        where: { userId: id, status: { notIn: ["CANCELLED", "PAYMENT_FAILED"] } },
        _sum: { total: true },
    })

    return {
        ...user,
        totalSpent: Number(totalSpent._sum.total || 0),
        orders: user.orders.map((order: any) => ({
            ...order,
            total: Number(order.total),
        })),
    }
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
    const { id } = await params
    const user = await getUserData(id)

    if (!user) {
        notFound()
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Detayı</h1>
                        <p className="text-muted-foreground">{user.name || "İsimsiz Kullanıcı"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <UserActions user={user} />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs font-medium uppercase">
                                    Toplam Harcama
                                </p>
                                <p className="text-primary text-2xl font-bold">
                                    {formatPrice(user.totalSpent)}
                                </p>
                            </div>
                            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                                <CreditCard className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs font-medium uppercase">
                                    Sipariş Sayısı
                                </p>
                                <p className="text-2xl font-bold">{user._count.orders}</p>
                            </div>
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs font-medium uppercase">
                                    Yorum Sayısı
                                </p>
                                <p className="text-2xl font-bold">{user._count.reviews}</p>
                            </div>
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                                <Star className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-xs font-medium uppercase">
                                    Rol
                                </p>
                                <div className="flex items-center gap-2">
                                    <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                                <Shield className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted rounded-xl p-1">
                    <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-background rounded-lg data-[state=active]:shadow-sm"
                    >
                        Genel Bakış
                    </TabsTrigger>
                    <TabsTrigger
                        value="orders"
                        className="data-[state=active]:bg-background rounded-lg data-[state=active]:shadow-sm"
                    >
                        Siparişler ({user._count.orders})
                    </TabsTrigger>
                    <TabsTrigger
                        value="addresses"
                        className="data-[state=active]:bg-background rounded-lg data-[state=active]:shadow-sm"
                    >
                        Adresler ({user._count.addresses})
                    </TabsTrigger>
                    <TabsTrigger
                        value="reviews"
                        className="data-[state=active]:bg-background rounded-lg data-[state=active]:shadow-sm"
                    >
                        Yorumlar ({user._count.reviews})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profil Bilgileri</CardTitle>
                                    <CardDescription>
                                        Kullanıcının temel hesap detayları
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <p className="text-muted-foreground text-sm">
                                                Ad Soyad
                                            </p>
                                            <div className="flex items-center gap-2 font-medium">
                                                <User className="text-primary h-4 w-4" />
                                                {user.name || "-"}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-muted-foreground text-sm">
                                                E-posta Adresi
                                            </p>
                                            <div className="flex items-center gap-2 font-medium">
                                                <Mail className="text-primary h-4 w-4" />
                                                {user.email}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-muted-foreground text-sm">Telefon</p>
                                            <div className="flex items-center gap-2 font-medium">
                                                <Phone className="text-primary h-4 w-4" />
                                                {user.phone || "-"}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-muted-foreground text-sm">
                                                Kayıt Tarihi
                                            </p>
                                            <div className="flex items-center gap-2 font-medium">
                                                <Calendar className="text-primary h-4 w-4" />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-muted-foreground text-sm">
                                                Hesap Durumu
                                            </p>
                                            <div className="flex items-center gap-2 font-medium">
                                                {user.status === "ACTIVE" ? (
                                                    <Badge className="border-none bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
                                                        <Unlock className="mr-1 h-3 w-3" /> AKTİF
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        <Lock className="mr-1 h-3 w-3" /> ASKIDA
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-muted-foreground text-sm">
                                                Son Giriş
                                            </p>
                                            <div className="flex items-center gap-2 font-medium">
                                                <Clock className="text-primary h-4 w-4" />
                                                {user.lastLogin
                                                    ? formatDate(user.lastLogin)
                                                    : "Henüz giriş yapılmadı"}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Kullanıcı Notları</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm italic">
                                        Admin notları özelliği yakında eklenecek.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Son Siparişler</CardTitle>
                            <CardDescription>Kullanıcının yaptığı son 10 sipariş</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.orders.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <p className="text-muted-foreground">
                                        Henüz sipariş bulunmuyor.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative overflow-x-auto rounded-lg border">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted text-muted-foreground border-b font-medium">
                                            <tr>
                                                <th className="px-4 py-3">Sipariş #</th>
                                                <th className="px-4 py-3">Tarih</th>
                                                <th className="px-4 py-3">Durum</th>
                                                <th className="px-4 py-3 text-right">Toplam</th>
                                                <th className="px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {user.orders.map((order: any) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-muted/50 group transition-colors"
                                                >
                                                    <td className="px-4 py-4 font-medium uppercase">
                                                        {order.orderNumber}
                                                    </td>
                                                    <td className="text-muted-foreground px-4 py-4">
                                                        {formatDate(order.createdAt)}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <Badge
                                                            variant="outline"
                                                            className="font-medium"
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-primary px-4 py-4 text-right font-bold">
                                                        {formatPrice(order.total)}
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link
                                                                href={`/admin/orders/${order.id}`}
                                                            >
                                                                İncele
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="addresses">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {user.addresses.length === 0 ? (
                            <Card className="col-span-full border-dashed">
                                <CardContent className="text-muted-foreground flex flex-col items-center justify-center py-12">
                                    <MapPin className="mb-4 h-12 w-12 opacity-20" />
                                    <p>Kayıtlı adres bulunmuyor.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            user.addresses.map((address: any) => (
                                <Card
                                    key={address.id}
                                    className={user.status === "ACTIVE" ? "" : "opacity-60"}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                {address.title}
                                            </CardTitle>
                                            {address.isDefault && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] font-bold uppercase tracking-wider"
                                                >
                                                    VARSAYILAN
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="text-sm">
                                        <p className="mb-1 font-medium">
                                            {address.firstName} {address.lastName}
                                        </p>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {address.address}
                                            <br />
                                            {address.district}, {address.city}
                                            <br />
                                            {address.country}
                                        </p>
                                        <div className="text-muted-foreground mt-4 flex items-center gap-2 border-t pt-4">
                                            <Phone className="h-3.5 w-3.5" />
                                            {address.phone}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="reviews">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ürün Değerlendirmeleri</CardTitle>
                            <CardDescription>Kullanıcının yaptığı tüm yorumlar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.reviews.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Star className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-20" />
                                    <p className="text-muted-foreground">Henüz yorum bulunmuyor.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {user.reviews.map((review: any) => (
                                        <div
                                            key={review.id}
                                            className="hover:border-primary/50 group flex gap-4 rounded-xl border p-4 transition-colors"
                                        >
                                            <div className="bg-muted h-16 w-16 shrink-0 overflow-hidden rounded border">
                                                {review.product.images[0] ? (
                                                    <img
                                                        src={review.product.images[0]}
                                                        alt={review.product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="text-muted-foreground m-auto h-8 w-8" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="group-hover:text-primary text-sm font-semibold transition-colors">
                                                        {review.product.name}
                                                    </h4>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                {review.title && (
                                                    <p className="text-sm font-medium">
                                                        {review.title}
                                                    </p>
                                                )}
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {review.comment}
                                                </p>
                                                <p className="text-muted-foreground pt-1 text-[10px]">
                                                    {formatDate(review.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
