export default function ShippingPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Kargo ve Teslimat</h1>

            <div className="prose prose-slate max-w-none space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-semibold">Gönderim Süresi</h2>
                    <p className="text-muted-foreground">
                        Siparişleriniz, onaylandıktan sonra en geç 1-3 iş günü içerisinde kargo
                        firmasına teslim edilmektedir. Kampanya dönemlerinde ve resmi tatillerde bu
                        süre değişiklik gösterebilir.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">Kargo Ücretleri</h2>
                    <p className="text-muted-foreground">
                        1000 TL ve üzeri alışverişlerinizde kargo ücretsizdir. Bu tutarın altındaki
                        siparişlerinizde sabit kargo ücreti sepetinize yansıtılmaktadır.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">Teslimat Süreci</h2>
                    <p className="text-muted-foreground">
                        Kargoya verilen ürünleriniz, teslimat adresinize bağlı olarak ortalama 1-3
                        iş günü içerisinde size ulaştırılır. Mobil bölgelerde teslimat süreleri
                        farklılık gösterebilir.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">Hasarlı Kargo</h2>
                    <p className="text-muted-foreground">
                        Kargo paketinizde herhangi bir hasar (ezilme, yırtılma, vs.) gördüğünüzde
                        kargo görevlisine tutanak tutturunuz ve paketi teslim almayınız. Tutanak
                        tutulmayan hasarlı ürünler için iade işlemi yapılamamaktadır.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">Kargo Takibi</h2>
                    <p className="text-muted-foreground">
                        Siparişiniz kargoya verildiğinde size SMS ve e-posta yoluyla bilgilendirme
                        yapılır. Ayrıca "Siparişlerim" sayfasından kargo takibini yapabilirsiniz.
                    </p>
                </section>
            </div>
        </div>
    )
}
