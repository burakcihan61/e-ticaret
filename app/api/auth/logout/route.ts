import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth"

export async function POST() {
    try {
        await removeAuthCookie()

        return NextResponse.json({
            message: "Çıkış başarılı",
        })
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json({ error: "Çıkış sırasında bir hata oluştu" }, { status: 500 })
    }
}

export async function GET() {
    try {
        await removeAuthCookie()
        return NextResponse.redirect(
            new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
        )
    } catch (error) {
        return NextResponse.redirect(
            new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
        )
    }
}
