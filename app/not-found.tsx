import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center px-4 text-center">
            <div className="bg-muted mb-6 rounded-full p-6">
                <FileQuestion className="text-muted-foreground h-12 w-12" />
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight">404</h1>
            <h2 className="mb-4 text-2xl font-semibold">Sayfa Bulunamadı</h2>
            <p className="text-muted-foreground mb-8 max-w-[500px]">
                Aradığınız sayfa mevcut değil, silinmiş veya taşınmış olabilir. Lütfen adresi
                kontrol edin veya ana sayfaya dönün.
            </p>
            <div className="flex gap-4">
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
