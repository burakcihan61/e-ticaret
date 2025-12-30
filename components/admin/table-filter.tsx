"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TableFilterProps {
    name: string
    label: string
    options: { label: string; value: string }[]
    defaultValue?: string
}

export default function TableFilter({
    name,
    label,
    options,
    defaultValue = "all",
}: TableFilterProps) {
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
        <Select value={currentValue} onValueChange={onValueChange}>
            <SelectTrigger className="h-10 w-[180px]">
                <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Tümü (Hepsi)</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
