"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, Home, Briefcase, Trash2, Edit, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddressForm, { AddressFormData } from "@/components/checkout/address-form"

interface Address {
    id: string
    title: string
    firstName: string
    lastName: string
    phone: string
    address: string
    city: string
    district: string
    postalCode: string | null
    isDefault: boolean
}

export default function AddressesClient({ initialAddresses }: { initialAddresses: Address[] }) {
    const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async (data: AddressFormData) => {
        setIsLoading(true)
        try {
            // Transform data to match API expectations
            const [firstName, ...lastNameParts] = data.fullName.split(" ")
            const lastName = lastNameParts.join(" ") || firstName

            const apiData = {
                title: "Ev", // Default title
                firstName,
                lastName,
                phone: data.phone,
                address: data.address,
                city: data.city,
                district: data.district,
                postalCode: data.zipCode || null,
                country: "Türkiye",
            }

            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiData),
            })

            if (res.ok) {
                const newAddress = await res.json()
                setAddresses([newAddress, ...addresses])
                setIsDialogOpen(false)
                toast.success("Adres eklendi")
            } else {
                const errorText = await res.text()
                toast.error(errorText || "Adres eklenemedi")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = async (data: AddressFormData) => {
        if (!editingAddress) return
        setIsLoading(true)
        try {
            // Transform data to match API expectations
            const [firstName, ...lastNameParts] = data.fullName.split(" ")
            const lastName = lastNameParts.join(" ") || firstName

            const apiData = {
                title: editingAddress.title, // Keep existing title
                firstName,
                lastName,
                phone: data.phone,
                address: data.address,
                city: data.city,
                district: data.district,
                postalCode: data.zipCode || null,
                country: "Türkiye",
            }

            const res = await fetch(`/api/user/addresses/${editingAddress.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiData),
            })

            if (res.ok) {
                const updated = await res.json()
                setAddresses(addresses.map((a) => (a.id === updated.id ? updated : a)))
                setIsDialogOpen(false)
                setEditingAddress(null)
                toast.success("Adres güncellendi")
            } else {
                const errorText = await res.text()
                toast.error(errorText || "Adres güncellenemedi")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return

        try {
            const res = await fetch(`/api/user/addresses/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                setAddresses(addresses.filter((a) => a.id !== id))
                toast.success("Adres silindi")
            } else {
                toast.error("Adres silinemedi")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        }
    }

    const openEditModel = (address: Address) => {
        setEditingAddress(address)
        setIsDialogOpen(true)
    }

    const openCreateModel = () => {
        setEditingAddress(null)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Adreslerim</h2>
                    <p className="text-muted-foreground">
                        Kayıtlı teslimat ve fatura adreslerinizi buradan yönetebilirsiniz.
                    </p>
                </div>
                <Button onClick={openCreateModel} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Adres Ekle
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
                        </DialogTitle>
                        <DialogDescription>
                            Teslimat adres bilgilerinizi aşağıdan düzenleyebilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <AddressForm
                        onSubmit={editingAddress ? handleUpdate : handleCreate}
                        isLoading={isLoading}
                        defaultValues={
                            editingAddress
                                ? {
                                    fullName: `${editingAddress.firstName} ${editingAddress.lastName}`,
                                    phone: editingAddress.phone,
                                    email: "", // Not stored directly in address
                                    address: editingAddress.address,
                                    city: editingAddress.city,
                                    district: editingAddress.district,
                                    zipCode: editingAddress.postalCode || "",
                                }
                                : undefined
                        }
                        buttonText={editingAddress ? "Güncelle" : "Kaydet"}
                    />
                </DialogContent>
            </Dialog>

            {addresses.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <MapPin className="text-muted-foreground h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold">Henüz kayıtlı bir adresiniz yok</h3>
                        <p className="text-muted-foreground mb-6">
                            Siparişlerinizi daha hızlı verebilmek için bir adres ekleyin.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                        <Card
                            key={address.id}
                            className={address.isDefault ? "border-primary" : ""}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {address.title.toLowerCase().includes("ev") ? (
                                            <Home className="text-primary h-4 w-4" />
                                        ) : address.title.toLowerCase().includes("iş") ||
                                            address.title.toLowerCase().includes("is") ? (
                                            <Briefcase className="text-primary h-4 w-4" />
                                        ) : (
                                            <MapPin className="text-primary h-4 w-4" />
                                        )}
                                        <CardTitle className="text-lg">{address.title}</CardTitle>
                                    </div>
                                    {address.isDefault && (
                                        <Badge
                                            variant="outline"
                                            className="text-primary border-primary"
                                        >
                                            Varsayılan
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-1 text-sm">
                                <p className="font-semibold">
                                    {address.firstName} {address.lastName}
                                </p>
                                <p className="text-muted-foreground">{address.address}</p>
                                <p className="text-muted-foreground">
                                    {address.district} / {address.city}
                                </p>
                                <p className="text-muted-foreground">{address.phone}</p>
                            </CardContent>
                            <CardFooter className="bg-muted/10 flex justify-between border-t py-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(address.id)}
                                >
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    Sil
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditModel(address)}
                                >
                                    <Edit className="mr-1 h-4 w-4" />
                                    Düzenle
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
