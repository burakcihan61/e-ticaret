export default function CookiesPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Çerez Politikası</h1>
            <p className="text-muted-foreground mb-6 text-sm">Son güncelleme: 30 Aralık 2025</p>

            <div className="prose prose-slate max-w-none space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-semibold">Çerez (Cookie) Nedir?</h2>
                    <p className="text-muted-foreground">
                        Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınız
                        aracılığıyla cihazınıza veya ağ sunucusuna depolanan küçük metin
                        dosyalarıdır.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">Kullanım Amaçları</h2>
                    <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                        <li>
                            Sitenin çalışması için gerekli temel fonksiyonları gerçekleştirmek (Örn:
                            Sepet işlemleri)
                        </li>
                        <li>
                            Siteyi analiz etmek ve performansını arttırmak (Örn: Ziyaretçi
                            istatistikleri)
                        </li>
                        <li>Sitenin işlevselliğini arttırmak ve kullanım kolaylığı sağlamak</li>
                        <li>Kişiselleştirme, hedefleme ve reklamcılık faaliyeti gerçekleştirmek</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">Çerez Yönetimi</h2>
                    <p className="text-muted-foreground">
                        İnternet tarayıcınızın ayarlarını değiştirerek çerezlere ilişkin
                        tercihlerinizi kişiselleştirme imkanına sahipsiniz. Çerezleri devre dışı
                        bırakmanız durumunda sitenin bazı özellikleri işlevselliğini yitirebilir.
                    </p>
                </section>
            </div>
        </div>
    )
}
