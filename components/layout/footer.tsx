import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        shop: [
            { label: "Tüm Ürünler", href: "/products" },
            { label: "Kategoriler", href: "/categories" },
            { label: "Yeni Ürünler", href: "/products?filter=new" },
            { label: "İndirimli Ürünler", href: "/products?filter=sale" },
        ],
        account: [
            { label: "Hesabım", href: "/account" },
            { label: "Siparişlerim", href: "/account/orders" },
            { label: "Adreslerim", href: "/account/addresses" },
            { label: "Favorilerim", href: "/account/wishlist" },
        ],
        help: [
            { label: "İletişim", href: "/contact" },
            { label: "SSS", href: "/faq" },
            { label: "Kargo ve Teslimat", href: "/shipping" },
            { label: "İade ve Değişim", href: "/returns" },
        ],
        legal: [
            { label: "Gizlilik Politikası", href: "/privacy" },
            { label: "Kullanım Koşulları", href: "/terms" },
            { label: "Çerez Politikası", href: "/cookies" },
            { label: "KVKK", href: "/kvkk" },
        ],
    }

    return (
        <footer className="bg-muted/40 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="mb-4 flex items-center space-x-2">
                            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                                <span className="text-primary-foreground text-lg font-bold">E</span>
                            </div>
                            <span className="text-xl font-bold">E-Ticaret</span>
                        </Link>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Kaliteli ürünler, uygun fiyatlar. Güvenli alışverişin adresi.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link
                                href="https://twitter.com"
                                target="_blank"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link
                                href="mailto:info@eticaret.com"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Mail className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="mb-4 font-semibold">Alışveriş</h3>
                        <ul className="space-y-2">
                            {footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h3 className="mb-4 font-semibold">Hesabım</h3>
                        <ul className="space-y-2">
                            {footerLinks.account.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h3 className="mb-4 font-semibold">Yardım</h3>
                        <ul className="space-y-2">
                            {footerLinks.help.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="mb-4 font-semibold">Yasal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
                    <p>© {currentYear} E-Ticaret. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    )
}
