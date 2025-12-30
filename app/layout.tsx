import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: {
        default: "BURAK Online Alışveriş & E-Ticaret",
        template: "%s | BURAK",
    },
    description:
        "BURAK ile güvenli ve hızlı online alışveriş. En kaliteli ürünler, uygun fiyatlar ve hızlı teslimat.",
    keywords: ["e-ticaret", "online alışveriş", "ürün satışı", "kampanya", "indirim", "BURAK"],
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: "/",
        siteName: "BURAK",
        title: "BURAK - Online Alışveriş & E-Ticaret",
        description: "En kaliteli ürünleri güvenli ödeme ve hızlı kargo ile BURAK’da keşfedin.",
    },
    twitter: {
        card: "summary_large_image",
        title: "BURAK - Online Alışveriş & E-Ticaret",
        description: "Güvenli ödeme, hızlı kargo ve avantajlı fiyatlarla online alışveriş.",
    },
}

import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { headers } from "next/headers"

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    // Global Maintenance Check
    let maintenanceMode = false
    try {
        const maintenance = await prisma.settings.findUnique({
            where: { key: "maintenance_mode" },
        })
        maintenanceMode = maintenance?.value === "true"
    } catch (error) {
        console.error("Maintenance check failed:", error)
    }

    if (maintenanceMode) {
        const headerList = await headers()
        const pathname = headerList.get("x-pathname") || ""

        // Helpers to identify routes
        const isMaintenancePage = pathname === "/maintenance"
        const isLoginPage = pathname === "/login" || pathname === "/admin/login"
        // Allow static assets and api
        const isStatic = pathname.startsWith("/_next") || pathname.includes(".")
        const isApiRoute = pathname.startsWith("/api/")

        if (!isMaintenancePage && !isLoginPage && !isApiRoute && !isStatic) {
            const session = await getSession()
            const isAdmin = session?.role === "ADMIN" || session?.role === "SUPER_ADMIN"

            if (!isAdmin) {
                redirect("/maintenance")
            }
        }
    }

    return (
        <html lang="en" suppressHydrationWarning className={inter.variable}>
            <head />
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
