"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCcw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[80vh] flex-col items-center justify-center px-4 text-center">
            <div className="bg-destructive/10 mb-6 rounded-full p-6">
                <AlertTriangle className="text-destructive h-12 w-12" />
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight">Bir Hata Oluştu</h1>
            <h2 className="mb-4 text-2xl font-semibold">Üzgünüz, bir şeyler yanlış gitti.</h2>
            <p className="text-muted-foreground mb-8 max-w-[500px]">
                Beklenmedik bir hata ile karşılaştık. Lütfen sayfayı yenilemeyi deneyin veya daha
                sonra tekrar ziyaret edin.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="outline">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Tekrar Dene
                </Button>
                <Button asChild variant="default">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Ana Sayfa
                    </Link>
                </Button>
            </div>
        </div>
    )
}
