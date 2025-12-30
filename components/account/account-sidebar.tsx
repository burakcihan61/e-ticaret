"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShoppingBag, User, MapPin, Heart, LogOut, ChevronRight } from "lucide-react"

const menuItems = [
    {
        title: "Siparişlerim",
        href: "/account/orders",
        icon: ShoppingBag,
    },
    {
        title: "Profil Bilgileri",
        href: "/account/profile",
        icon: User,
    },
    {
        title: "Adreslerim",
        href: "/account/addresses",
        icon: MapPin,
    },
    {
        title: "Favorilerim",
        href: "/account/wishlist",
        icon: Heart,
    },
]

export default function AccountSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-full space-y-2 lg:w-64">
            <div className="bg-card rounded-lg border p-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
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
                <hr className="border-muted my-2" />
                <button
                    onClick={() => {
                        // Implement logout logic here or via a link
                        window.location.href = "/api/auth/logout"
                    }}
                    className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Çıkış Yap
                </button>
            </div>
        </aside>
    )
}
