"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    Users,
    Ticket,
    Settings,
    ChevronRight,
    LogOut,
    Store,
} from "lucide-react"

const adminMenuItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Ürünler",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Kategoriler",
        href: "/admin/categories",
        icon: Layers,
    },
    {
        title: "Siparişler",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        title: "Müşteriler",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Kuponlar",
        href: "/admin/coupons",
        icon: Ticket,
    },
    {
        title: "Ayarlar",
        href: "/admin/settings",
        icon: Settings,
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="bg-card sticky top-0 flex h-screen w-full flex-col border-r lg:w-64">
            <div className="border-b p-6">
                <Link
                    href="/admin"
                    className="text-primary flex items-center gap-2 text-xl font-bold"
                >
                    <Store className="h-6 w-6" />
                    <span>Mağaza Admin</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {adminMenuItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </div>
                            <ChevronRight
                                className={cn(
                                    "h-4 w-4 transition-transform",
                                    isActive ? "rotate-90 md:rotate-0" : ""
                                )}
                            />
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto space-y-2 border-t p-4">
                <Link
                    href="/"
                    className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors"
                >
                    <Store className="h-5 w-5" />
                    Mağazaya Dön
                </Link>
                <Link
                    href="/api/auth/logout"
                    className="text-destructive hover:bg-destructive/10 flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Çıkış Yap
                </Link>
            </div>
        </aside>
    )
}
