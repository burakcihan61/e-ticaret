"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Globe, Truck, ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [settings, setSettings] = useState<Record<string, string>>({
        store_name: "Brkchn Store",
        store_email: "support@brkchn.com",
        shipping_fee: "29.90",
        free_shipping_threshold: "500",
        maintenance_mode: "false",
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/admin/settings")
            if (response.ok) {
                const data = await response.json()
                setSettings((prev) => ({ ...prev, ...data }))
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateSetting = async (key: string, value: string) => {
        try {
            setSettings((prev) => ({ ...prev, [key]: value }))
            const response = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value }),
            })

            if (!response.ok) throw new Error()

            if (key === "maintenance_mode") {
                toast.success(value === "true" ? "Bakım modu aktif" : "Bakım modu pasif")
            }
        } catch (error) {
            toast.error("Ayar güncellenemedi")
            fetchSettings() // Revert
        }
    }

    const handleSaveAll = async () => {
        try {
            setIsSaving(true)
            // In a real app, you might want a bulk update endpoint
            // For now, we'll just save the visible fields
            const keysToSave = [
                "store_name",
                "store_email",
                "shipping_fee",
                "free_shipping_threshold",
            ]

            await Promise.all(
                keysToSave.map((key) =>
                    fetch("/api/admin/settings", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ key, value: settings[key] }),
                    })
                )
            )

            toast.success("Tüm ayarlar kaydedildi")
        } catch (error) {
            toast.error("Ayarlar kaydedilirken hata oluştu")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mağaza Ayarları</h1>
                <p className="text-muted-foreground">
                    Genel mağaza yapılandırmasını ve politikalarını yönetin.
                </p>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Genel Bilgiler
                        </CardTitle>
                        <CardDescription>Mağaza adı ve temel bilgiler.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="store_name">Mağaza Adı</Label>
                                <Input
                                    id="store_name"
                                    value={settings.store_name}
                                    onChange={(e) =>
                                        setSettings({ ...settings, store_name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store_email">Destek Email</Label>
                                <Input
                                    id="store_email"
                                    value={settings.store_email}
                                    onChange={(e) =>
                                        setSettings({ ...settings, store_email: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Kargo ve Teslimat
                        </CardTitle>
                        <CardDescription>Kargo ücretleri ve eşikleri.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="shipping_fee">Standart Kargo Ücreti (TL)</Label>
                                <Input
                                    id="shipping_fee"
                                    type="number"
                                    value={settings.shipping_fee}
                                    onChange={(e) =>
                                        setSettings({ ...settings, shipping_fee: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="free_shipping_threshold">
                                    Ücretsiz Kargo Alt Limiti (TL)
                                </Label>
                                <Input
                                    id="free_shipping_threshold"
                                    type="number"
                                    value={settings.free_shipping_threshold}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            free_shipping_threshold: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security & System */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5" />
                            Sistem ve Güvenlik
                        </CardTitle>
                        <CardDescription>Bakım modu ve erişim ayarları.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <p className="font-medium">Bakım Modu</p>
                                <p className="text-muted-foreground text-sm">
                                    Açıldığında mağaza sadece adminlere görünür olur.
                                </p>
                            </div>
                            <Switch
                                checked={settings.maintenance_mode === "true"}
                                onCheckedChange={(checked: boolean) =>
                                    handleUpdateSetting("maintenance_mode", String(checked))
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSaveAll} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Tüm Ayarları Kaydet
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
