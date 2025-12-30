"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">İletişim</h1>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Contact Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bize Ulaşın</CardTitle>
                        <CardDescription>
                            Soru ve görüşleriniz için aşağıdaki formu doldurabilirsiniz.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Ad</Label>
                                    <Input id="firstName" placeholder="Adınız" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Soyad</Label>
                                    <Input id="lastName" placeholder="Soyadınız" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta</Label>
                                <Input id="email" type="email" placeholder="ornek@domain.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Konu</Label>
                                <Input id="subject" placeholder="Mesajınızın konusu" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Mesaj</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Mesajınızı buraya yazın..."
                                    className="min-h-[120px]"
                                />
                            </div>
                            <Button className="w-full">Gönder</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Company Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>İletişim Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-primary mt-0.5 h-5 w-5" />
                                <div>
                                    <p className="font-semibold">Adres</p>
                                    <p className="text-muted-foreground">
                                        Örnek Mahallesi, Teknoloji Caddesi No: 123
                                        <br />
                                        Çankaya / Ankara
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-primary h-5 w-5" />
                                <div>
                                    <p className="font-semibold">Telefon</p>
                                    <p className="text-muted-foreground">+90 (555) 123 45 67</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="text-primary h-5 w-5" />
                                <div>
                                    <p className="font-semibold">E-posta</p>
                                    <p className="text-muted-foreground">iletisim@yardimcin.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="text-primary mt-0.5 h-5 w-5" />
                                <div>
                                    <p className="font-semibold">Çalışma Saatleri</p>
                                    <p className="text-muted-foreground">
                                        Pazartesi - Cuma: 09:00 - 18:00
                                        <br />
                                        Cumartesi: 10:00 - 14:00
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Map Placeholder */}
                    <div className="bg-muted relative flex h-[300px] items-center justify-center overflow-hidden rounded-lg border">
                        {/* Replace with actual iframe */}
                        <div className="text-muted-foreground flex flex-col items-center">
                            <MapPin className="mb-2 h-10 w-10 opacity-50" />
                            <span className="text-sm">Google Maps Harita Alanı</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
