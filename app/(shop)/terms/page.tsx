export default function TermsPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Kullanım Koşulları</h1>
            <p className="text-muted-foreground mb-6 text-sm">Son güncelleme: 30 Aralık 2025</p>

            <div className="prose prose-slate max-w-none space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-semibold">1. Genel Hükümler</h2>
                    <p className="text-muted-foreground">
                        Bu internet sitesine girmeniz veya bu internet sitesindeki herhangi bir
                        bilgiyi kullanmanız aşağıdaki koşulları kabul ettiğiniz anlamına gelir.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">2. Fikri Mülkiyet</h2>
                    <p className="text-muted-foreground">
                        Bu sitede bulunan bilgiler, yazılar, resimler, markalar, slogan ve diğer
                        işaretler ile sair sınaî ve fikri mülkiyet haklarına ilişkin bilgilerin
                        korunmasına yönelik programlarla, sayfa düzeni ve sitenin sunumu izin
                        alınmadan kopyalanamaz ve kullanılamaz.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">3. Sorumluluk Reddi</h2>
                    <p className="text-muted-foreground">
                        Şirketimiz, bu sitenin kullanımından doğabilecek doğrudan veya dolaylı
                        zararlardan sorumlu tutulamaz. Sitede yer alan bilgilerin doğruluğu ve
                        güncelliği konusunda azami özen gösterilmekle birlikte garanti
                        verilmemektedir.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-semibold">4. Kullanıcı Yükümlülükleri</h2>
                    <p className="text-muted-foreground">
                        Kullanıcı, siteyi kullanırken yasalara, genel ahlak kurallarına ve üçüncü
                        kişilerin haklarına saygı göstermeyi kabul eder.
                    </p>
                </section>
            </div>
        </div>
    )
}
