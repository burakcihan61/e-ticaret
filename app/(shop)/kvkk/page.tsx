export default function KvkkPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">KVKK Aydınlatma Metni</h1>
            <p className="text-muted-foreground mb-6 text-sm">Son güncelleme: 30 Aralık 2025</p>

            <div className="prose prose-slate max-w-none space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-semibold">1. Veri Sorumlusu</h2>
                    <p className="text-muted-foreground">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verileriniz
                        veri sorumlusu olarak Şirketimiz tarafından aşağıda açıklanan kapsamda
                        işlenebilecektir.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">2. İşlenen Kişisel Veriler</h2>
                    <p className="text-muted-foreground">
                        Kimlik Bilgileri, İletişim Bilgileri, Müşteri İşlem Bilgileri, İşlem
                        Güvenliği Bilgileri gibi verileriniz işlenmektedir.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">
                        3. Kişisel Verilerin İşlenme Amacı
                    </h2>
                    <p className="text-muted-foreground">
                        Kişisel verileriniz; ürün ve hizmetlerin sizlere sunulabilmesi, ticari
                        faaliyetlerin yürütülmesi, yasal yükümlülüklerin yerine getirilmesi gibi
                        amaçlarla işlenmektedir.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">4. Haklarınız</h2>
                    <p className="text-muted-foreground">
                        KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini
                        öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve
                        amacına uygun kullanılıp kullanılmadığını öğrenme haklarına sahipsiniz.
                    </p>
                </section>
            </div>
        </div>
    )
}
