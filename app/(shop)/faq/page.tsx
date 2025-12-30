"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface FAQItem {
    question: string
    answer: string
    category: string
}

const faqs: FAQItem[] = [
    {
        category: "Siparişler",
        question: "Siparişimi nasıl takip edebilirim?",
        answer: "Siparişinizi verdikten sonra size gönderilen e-posta veya SMS'teki takip numarası ile 'Siparişlerim' sayfasından kargo durumunu takip edebilirsiniz.",
    },
    {
        category: "Siparişler",
        question: "Siparişimi iptal edebilir miyim?",
        answer: "Siparişiniz kargoya verilmediği sürece iptal edebilirsiniz. Kargoya verilen siparişler için iade prosedürü uygulanır.",
    },
    {
        category: "Teslimat",
        question: "Kargo ücreti ne kadar?",
        answer: "1000 TL ve üzeri alışverişlerde kargo ücretsizdir. Altındaki tutarlar için sabit kargo ücreti uygulanır.",
    },
    {
        category: "Teslimat",
        question: "Hangi kargo firmalarıyla çalışıyorsunuz?",
        answer: "Aras Kargo, Yurtiçi Kargo ve MNG Kargo ile anlaşmamız bulunmaktadır.",
    },
    {
        category: "İade & Değişim",
        question: "İade süresi kaç gündür?",
        answer: "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz.",
    },
    {
        category: "Ödeme",
        question: "Kapıda ödeme var mı?",
        answer: "Evet, kapıda nakit veya kredi kartı ile ödeme seçeneğimiz mevcuttur.",
    },
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <h1 className="mb-2 text-center text-3xl font-bold">Sıkça Sorulan Sorular</h1>
            <p className="text-muted-foreground mb-10 text-center">
                Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
            </p>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <Card
                        key={index}
                        className={`overflow-hidden transition-all duration-200 ${openIndex === index ? "ring-primary/5 ring-2" : ""}`}
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="hover:bg-muted/50 flex w-full items-center justify-between px-6 py-4 text-left transition-colors"
                        >
                            <span className="pr-8 font-medium">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="text-muted-foreground h-5 w-5 shrink-0" />
                            ) : (
                                <ChevronDown className="text-muted-foreground h-5 w-5 shrink-0" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="text-muted-foreground animate-in slide-in-from-top-1 fade-in-20 px-6 pb-4 pt-1">
                                {faq.answer}
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
