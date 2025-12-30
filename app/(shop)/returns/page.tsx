export default function ReturnsPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">İade ve Değişim</h1>

            <div className="prose prose-slate max-w-none space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-semibold">Cayma Hakkı</h2>
                    <p className="text-muted-foreground">
                        Tüketici Kanunu gereğince, siparişinizi teslim aldığınız tarihten itibaren
                        14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin
                        sözleşmeden cayma hakkına sahipsiniz.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">İade Koşulları</h2>
                    <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                        <li>
                            İade edilecek ürünün ambalajı açılmamış, kullanılmamış ve zarar görmemiş
                            olması gerekmektedir.
                        </li>
                        <li>
                            Etiketi koparılmış veya deforme olmuş ürünlerin iadesi kabul
                            edilmemektedir.
                        </li>
                        <li>
                            İç giyim, mayo, kozmetik gibi hijyenik ürünlerde değişim ve iade
                            yapılmamaktadır.
                        </li>
                        <li>
                            Ürünle birlikte gönderilen fatura ve aksesuarların eksiksiz olarak
                            gönderilmesi gerekmektedir.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">İade Süreci</h2>
                    <p className="text-muted-foreground">
                        İade işlemini başlatmak için "Siparişlerim" sayfasından ilgili siparişi
                        seçerek iade talebi oluşturabilirsiniz. Talebiniz onaylandıktan sonra size
                        verilen iade kodu ile ürünü anlaşmalı kargo şubesine teslim edebilirsiniz.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">Geri Ödeme</h2>
                    <p className="text-muted-foreground">
                        İade ettiğiniz ürün depomuza ulaşıp kontrolleri yapıldıktan sonra, ödeme
                        yaptığınız karta iade işlemi gerçekleştirilir. İadenin ekstrenize yansıması
                        bankanıza bağlı olarak 3-7 iş günü sürebilir.
                    </p>
                </section>
            </div>
        </div>
    )
}
