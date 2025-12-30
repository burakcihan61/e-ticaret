"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Home, Briefcase, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Address {
    id: string
    title: string
    firstName: string
    lastName: string
    phone: string
    address: string
    city: string
    district: string
    isDefault: boolean
}

interface AddressSelectorProps {
    addresses: Address[]
    selectedAddressId?: string | null
    onSelect: (address: Address) => void
    onAddNew: () => void
}

export default function AddressSelector({
    addresses,
    selectedAddressId,
    onSelect,
    onAddNew,
}: AddressSelectorProps) {
    return (
        <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold">Teslimat Adresi Seçin</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {addresses.map((address) => (
                    <Card
                        key={address.id}
                        className={cn(
                            "hover:border-primary cursor-pointer transition-all",
                            selectedAddressId === address.id
                                ? "border-primary ring-primary/10 border-2 ring-2"
                                : "border"
                        )}
                        onClick={() => onSelect(address)}
                    >
                        <CardContent className="p-4">
                            <div className="mb-2 flex items-start justify-between">
                                <div className="flex items-center gap-2 font-semibold">
                                    {address.title === "Ev" ? (
                                        <Home className="text-primary h-4 w-4" />
                                    ) : address.title === "İş" ? (
                                        <Briefcase className="text-primary h-4 w-4" />
                                    ) : (
                                        <MapPin className="text-primary h-4 w-4" />
                                    )}
                                    {address.title}
                                </div>
                                {address.isDefault && (
                                    <Badge
                                        variant="outline"
                                        className="text-primary border-primary h-5 text-[10px] font-bold uppercase"
                                    >
                                        Varsayılan
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-1 text-sm">
                                <p className="font-medium">
                                    {address.firstName} {address.lastName}
                                </p>
                                <p className="text-muted-foreground line-clamp-2">
                                    {address.address}
                                </p>
                                <p className="text-muted-foreground">
                                    {address.district}, {address.city}
                                </p>
                                <p className="text-muted-foreground">{address.phone}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Card
                    className="hover:border-primary hover:bg-primary/5 flex min-h-[140px] cursor-pointer flex-col items-center justify-center border-dashed p-4 transition-all"
                    onClick={onAddNew}
                >
                    <div className="bg-primary/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full">
                        <Plus className="text-primary h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">Yeni Adres Ekle</p>
                </Card>
            </div>
        </div>
    )
}
