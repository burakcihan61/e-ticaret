import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { headers } from "next/headers"

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
    const headerList = await headers()

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
