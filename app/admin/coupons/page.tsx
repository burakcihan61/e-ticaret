"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Loader2, Trash2, Plus, Ticket } from "lucide-react"

interface Coupon {
    id: string
    code: string
    type: "PERCENTAGE" | "FIXED_AMOUNT"
    value: number
    minOrderAmount: number | null
    usageLimit: number | null
    usageCount: number
    expiresAt: string | null
    isActive: boolean
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)

    // New coupon form state
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        type: "PERCENTAGE",
        value: "",
        minOrderAmount: "",
        usageLimit: "",
        expiresAt: "",
    })

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        try {
            const res = await fetch("/api/admin/coupons")
            if (res.ok) {
                const data = await res.json()
                setCoupons(data)
            }
        } catch (error) {
            toast.error("Kuponlar yüklenemedi")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)

        try {
            const res = await fetch("/api/admin/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCoupon),
            })

            if (res.ok) {
                toast.success("Kupon oluşturuldu")
                setNewCoupon({
                    code: "",
                    type: "PERCENTAGE",
                    value: "",
                    minOrderAmount: "",
                    usageLimit: "",
                    expiresAt: "",
                })
                fetchCoupons()
            } else {
                const error = await res.text()
                toast.error(error || "Kupon oluşturulamadı")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsCreating(false)
        }
    }

    const handleDeleteCoupon = async (id: string) => {
        if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return

        try {
            const res = await fetch(`/api/admin/coupons/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                toast.success("Kupon silindi")
                setCoupons(coupons.filter((c) => c.id !== id))
            } else {
                toast.error("Kupon silinemedi")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Kupon Yönetimi</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Create Coupon Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Yeni Kupon Oluştur</CardTitle>
                        <CardDescription>Müşteriler için indirim kodu tanımlayın.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateCoupon} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Kupon Kodu</Label>
                                <Input
                                    id="code"
                                    placeholder="ÖRN: YAZ2025"
                                    value={newCoupon.code}
                                    onChange={(e) =>
                                        setNewCoupon({
                                            ...newCoupon,
                                            code: e.target.value.toUpperCase(),
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">İndirim Tipi</Label>
                                    <Select
                                        value={newCoupon.type}
                                        onValueChange={(val) =>
                                            setNewCoupon({ ...newCoupon, type: val })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PERCENTAGE">Yüzde (%)</SelectItem>
                                            <SelectItem value="FIXED_AMOUNT">
                                                Sabit Tutar (TL)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="value">Değer</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        placeholder="Örn: 10"
                                        value={newCoupon.value}
                                        onChange={(e) =>
                                            setNewCoupon({ ...newCoupon, value: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="minAmount">Min. Sepet Tutarı (Opsiyonel)</Label>
                                    <Input
                                        id="minAmount"
                                        type="number"
                                        placeholder="0"
                                        value={newCoupon.minOrderAmount}
                                        onChange={(e) =>
                                            setNewCoupon({
                                                ...newCoupon,
                                                minOrderAmount: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="limit">Kullanım Limiti (Opsiyonel)</Label>
                                    <Input
                                        id="limit"
                                        type="number"
                                        placeholder="Sınırsız"
                                        value={newCoupon.usageLimit}
                                        onChange={(e) =>
                                            setNewCoupon({
                                                ...newCoupon,
                                                usageLimit: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="expires">Son Kullanma Tarihi (Opsiyonel)</Label>
                                <Input
                                    id="expires"
                                    type="date"
                                    value={newCoupon.expiresAt}
                                    onChange={(e) =>
                                        setNewCoupon({ ...newCoupon, expiresAt: e.target.value })
                                    }
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Oluşturuluyor
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Kupon Oluştur
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Coupons List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mevcut Kuponlar</CardTitle>
                        <CardDescription>Aktif ve geçmiş kuponların listesi.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : coupons.length === 0 ? (
                            <div className="text-muted-foreground p-8 text-center">
                                <Ticket className="mx-auto mb-2 h-12 w-12 opacity-20" />
                                <p>Henüz kupon oluşturulmamış.</p>
                            </div>
                        ) : (
                            <div className="max-h-[500px] overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kod</TableHead>
                                            <TableHead>Değer</TableHead>
                                            <TableHead>Kullanım</TableHead>
                                            <TableHead className="text-right">İşlem</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coupons.map((coupon) => (
                                            <TableRow key={coupon.id}>
                                                <TableCell className="font-medium">
                                                    {coupon.code}
                                                </TableCell>
                                                <TableCell>
                                                    {coupon.type === "PERCENTAGE"
                                                        ? `%${coupon.value}`
                                                        : `₺${coupon.value}`}
                                                </TableCell>
                                                <TableCell>
                                                    {coupon.usageCount} / {coupon.usageLimit || "∞"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteCoupon(coupon.id)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
