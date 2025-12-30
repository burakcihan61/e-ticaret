"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableSortProps {
    name: string
    label: string
    className?: string
}

export default function TableSort({ name, label, className }: TableSortProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const sortBy = searchParams.get("sortBy")
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const isActive = sortBy === name

    const handleSort = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (isActive) {
            // Toggle order
            params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc")
        } else {
            // New sort
            params.set("sortBy", name)
            params.set("sortOrder", "desc")
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <button
            onClick={handleSort}
            className={cn(
                "hover:text-foreground group inline-flex items-center gap-1 transition-colors",
                isActive && "text-foreground font-bold",
                className
            )}
        >
            {label}
            {isActive ? (
                sortOrder === "asc" ? (
                    <ArrowUp className="text-primary h-3.5 w-3.5" />
                ) : (
                    <ArrowDown className="text-primary h-3.5 w-3.5" />
                )
            ) : (
                <ArrowUpDown className="text-muted-foreground/50 group-hover:text-muted-foreground h-3.5 w-3.5 transition-colors" />
            )}
        </button>
    )
}
