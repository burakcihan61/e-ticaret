"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TableSearchProps {
    placeholder?: string
}

export default function TableSearch({ placeholder = "Ara..." }: TableSearchProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const initialSearch = searchParams.get("search") || ""
    const [value, setValue] = useState(initialSearch)
    const lastPushedValue = useRef(initialSearch)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (value === lastPushedValue.current) return

            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set("search", value)
            } else {
                params.delete("search")
            }
            params.set("page", "1")

            lastPushedValue.current = value
            router.push(`${pathname}?${params.toString()}`)
        }, 500)

        return () => clearTimeout(timer)
    }, [value, pathname, router, searchParams])

    // Update internal state if URL changes externally (e.g. back button)
    useEffect(() => {
        const currentSearch = searchParams.get("search") || ""
        if (currentSearch !== value) {
            setValue(currentSearch)
            lastPushedValue.current = currentSearch
        }
    }, [searchParams])

    return (
        <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-10 pl-9"
            />
        </div>
    )
}
