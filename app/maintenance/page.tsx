import { Store, Hammer, Wrench, Clock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MaintenancePage() {
    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="animate-in fade-in zoom-in max-w-2xl space-y-6 duration-500">
                {/* Brand / Logo */}
                <div className="mb-8 flex items-center justify-center gap-3">
                    <div className="bg-primary text-primary-foreground shadow-primary/20 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg">
                        <Store className="h-7 w-7" />
                    </div>
                    <span className="text-3xl font-bold tracking-tight">Brkchn Store</span>
                </div>

                {/* Illustration / Icons */}
                <div className="relative flex justify-center py-10">
                    <div className="bg-primary/10 absolute inset-0 rounded-full blur-3xl" />
                    <div className="text-primary relative flex gap-4">
                        <div className="bg-card rotate-[-12deg] rounded-2xl border p-4 shadow-sm transition-transform hover:rotate-0">
                            <Hammer className="h-10 w-10" />
                        </div>
                        <div className="bg-primary text-primary-foreground z-10 scale-110 rounded-2xl border p-4 shadow-xl">
                            <Wrench className="h-10 w-10 animate-pulse" />
                        </div>
                        <div className="bg-card rotate-[12deg] rounded-2xl border p-4 shadow-sm transition-transform hover:rotate-0">
                            <Clock className="h-10 w-10" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                        Bakım Modundayız
                    </h1>
                    <p className="text-muted-foreground text-xl leading-relaxed">
                        Sizlere daha iyi bir alışveriş deneyimi sunmak için sistemlerimizi
                        güncelliyoruz. Çok yakında geri döneceğiz!
                    </p>
                </div>

                {/* Status Card */}
                <div className="bg-card border-primary/20 rounded-2xl border p-6 shadow-sm">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-3 text-left">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    Destek ekibimizle iletişime geçin
                                </p>
                                <p className="text-muted-foreground text-sm">support@brkchn.com</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full md:w-auto" asChild>
                            <Link href="/">Yenile</Link>
                        </Button>
                    </div>
                </div>

                {/* Admin entry */}
                <div className="pt-8">
                    <Link
                        href="/login"
                        className="text-muted-foreground hover:text-primary text-xs underline-offset-4 transition-colors hover:underline"
                    >
                        Yönetici Girişi
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <p className="text-muted-foreground fixed bottom-8 text-sm opacity-50">
                &copy; {new Date().getFullYear()} Brkchn Store. Tüm hakları saklıdır.
            </p>
        </div>
    )
}
