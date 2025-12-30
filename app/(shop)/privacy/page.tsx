export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Gizlilik Politikası</h1>
            <p className="text-muted-foreground mb-6 text-sm">Son güncelleme: 30 Aralık 2025</p>

            <div className="prose prose-slate max-w-none space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-semibold">1. Veri Toplama</h2>
                    <p className="text-muted-foreground">
                        Sitemizi ziyaret ettiğinizde veya alışveriş yaptığınızda; adınız, adresiniz,
                        e-posta adresiniz ve telefon numaranız gibi kişisel bilgilerinizi
                        topluyoruz. Bu bilgiler, siparişlerinizi işleme almak ve size daha iyi
                        hizmet sunmak için kullanılmaktadır.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">2. Veri Kullanımı</h2>
                    <p className="text-muted-foreground">
                        Topladığımız veriler şu amaçlarla kullanılmaktadır:
                    </p>
                    <ul className="text-muted-foreground mt-2 list-disc pl-5">
                        <li>Siparişlerin hazırlanması ve teslimatı</li>
                        <li>Müşteri hizmetleri desteği sağlanması</li>
                        <li>Kampanya ve duyuruların iletilmesi (onayınız dahilinde)</li>
                        <li>Site güvenliğinin sağlanması</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">3. Veri Paylaşımı</h2>
                    <p className="text-muted-foreground">
                        Kişisel verileriniz, yasal zorunluluklar haricinde ve sipariş teslimatı için
                        gerekli olan iş ortaklarımız (kargo firmaları, ödeme sistemleri) dışında
                        üçüncü şahıslarla paylaşılmamaktadır.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">4. Veri Güvenliği</h2>
                    <p className="text-muted-foreground">
                        Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak
                        için endüstri standardı güvenlik önlemleri (SSL şifreleme vb.)
                        kullanmaktayız.
                    </p>
                </section>
            </div>
        </div>
    )
}
