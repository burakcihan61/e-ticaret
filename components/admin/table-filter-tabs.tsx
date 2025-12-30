"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Clock,
    XCircle,
    CheckCircle2,
    Package,
    Truck,
    AlertCircle,
    Pencil,
    User,
    Shield,
} from "lucide-react"

const IconMap: Record<string, any> = {
    Clock,
    XCircle,
    CheckCircle2,
    Package,
    Truck,
    AlertCircle,
    Pencil,
    User,
    Shield,
}

interface TableFilterTabsProps {
    name: string
    options: { label: string; value: string; icon?: string }[]
    defaultValue?: string
}

export default function TableFilterTabs({
    name,
    options,
    defaultValue = "all",
}: TableFilterTabsProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentValue = searchParams.get(name) || defaultValue

    const onValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "all") {
            params.set(name, value)
        } else {
            params.delete(name)
        }
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="no-scrollbar w-full overflow-x-auto py-2">
            <div className="flex w-max space-x-2">
                <Button
                    variant={currentValue === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onValueChange("all")}
                    className={cn(
                        "h-9 whitespace-nowrap rounded-full px-4",
                        currentValue === "all"
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-background hover:bg-muted"
                    )}
                >
                    Tümü
                </Button>
                {options.map((option) => {
                    const Icon = option.icon ? IconMap[option.icon] : null
                    return (
                        <Button
                            key={option.value}
                            variant={currentValue === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onValueChange(option.value)}
                            className={cn(
                                "h-9 whitespace-nowrap rounded-full px-4",
                                currentValue === option.value
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-background hover:bg-muted"
                            )}
                        >
                            {Icon && <Icon className="mr-2 h-4 w-4" />}
                            {option.label}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
