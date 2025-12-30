"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Search, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { useCartStore } from "@/store/useCartStore"
import { ModeToggle } from "../dark-light-mode-toggle"

interface User {
    id: string
    email: string
    name?: string | null
    role: string
}

export default function Header() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const cartItemCount = useCartStore((state) => state.getItemCount())

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const response = await fetch("/api/auth/me")
            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            }
        } catch (error) {
            console.error("Failed to fetch user:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            setUser(null)
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const getUserInitials = () => {
        if (user?.name) {
            return user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
        }
        return user?.email?.[0]?.toUpperCase() || "U"
    }

    const navLinks = [
        { href: "/", label: "Ana Sayfa" },
        { href: "/products", label: "Ürünler" },
        { href: "/categories", label: "Kategoriler" },
    ]

    return (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                            <span className="text-primary-foreground text-lg font-bold">E</span>
                        </div>
                        <span className="hidden text-xl font-bold sm:inline-block">E-Ticaret</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-6 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:text-primary text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar - Desktop */}
                    <div className="mx-8 hidden max-w-md flex-1 lg:flex">
                        <div className="relative w-full">
                            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <Input
                                type="search"
                                placeholder="Ürün ara..."
                                className="w-full pl-10"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Mode Toggle */}
                        <Button variant="default" size="icon" className="relative" asChild>
                            <ModeToggle />
                        </Button>

                        {/* Cart */}
                        <Button variant="ghost" size="icon" className="relative" asChild>
                            <Link href="/cart">
                                <ShoppingCart className="h-5 w-5" />
                                {cartItemCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                                    >
                                        {cartItemCount}
                                    </Badge>
                                )}
                            </Link>
                        </Button>

                        {/* User Menu */}
                        {!isLoading && (
                            <>
                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="relative h-9 w-9 rounded-full"
                                            >
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback>
                                                        {getUserInitials()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {user.name || "Kullanıcı"}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs leading-none">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/account">Hesabım</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/account/orders">Siparişlerim</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/account/wishlist">Favorilerim</Link>
                                            </DropdownMenuItem>
                                            {(user.role === "ADMIN" ||
                                                user.role === "SUPER_ADMIN") && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href="/admin">Admin Panel</Link>
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Çıkış Yap
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="hidden items-center space-x-2 md:flex">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href="/login">Giriş Yap</Link>
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href="/register">Kayıt Ol</Link>
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="mt-8 flex flex-col space-y-4">
                                    {/* Mobile Search */}
                                    <div className="relative">
                                        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            type="search"
                                            placeholder="Ürün ara..."
                                            className="pl-10"
                                        />
                                    </div>

                                    {/* Mobile Nav Links */}
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="hover:text-primary text-lg font-medium transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    {/* Mobile User Section */}
                                    {!user && (
                                        <div className="flex flex-col space-y-2 border-t pt-4">
                                            <Button asChild>
                                                <Link href="/login">Giriş Yap</Link>
                                            </Button>
                                            <Button variant="outline" asChild>
                                                <Link href="/register">Kayıt Ol</Link>
                                            </Button>
                                        </div>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
