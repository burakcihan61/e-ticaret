"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface TablePaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
}

export default function TablePagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
}: TablePaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    if (totalPages <= 1)
        return (
            <div className="bg-muted/30 flex items-center justify-between border-t px-6 py-4">
                <div className="text-muted-foreground text-sm">
                    Toplam <span className="text-foreground font-medium">{totalItems}</span> sonuç
                    listeleniyor
                </div>
            </div>
        )

    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    const renderPageButtons = () => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (currentPage > 3) pages.push("ellipsis-1")

            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i)
            }

            if (currentPage < totalPages - 2) pages.push("ellipsis-2")
            pages.push(totalPages)
        }

        return pages.map((page, index) => {
            if (typeof page === "string") {
                return (
                    <div key={page} className="flex h-8 w-8 items-center justify-center">
                        <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                    </div>
                )
            }
            return (
                <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={cn(
                        "h-8 w-8 rounded-md p-0 transition-all",
                        currentPage === page
                            ? "pointer-events-none shadow-sm"
                            : "hover:bg-primary/10 hover:text-primary"
                    )}
                    onClick={() => goToPage(page)}
                >
                    {page}
                </Button>
            )
        })
    }

    return (
        <div className="bg-muted/30 flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
            <div className="text-muted-foreground text-sm">
                <span className="text-foreground font-medium">{totalItems}</span> sonuçtan{" "}
                <span className="text-foreground font-medium">
                    {startItem}-{endItem}
                </span>{" "}
                arası gösteriliyor
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-md px-3"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Önceki
                </Button>
                <div className="hidden items-center gap-1 md:flex">{renderPageButtons()}</div>
                <div className="bg-muted flex items-center rounded-md px-3 py-1 text-sm font-medium md:hidden">
                    {currentPage} / {totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-md px-3"
                    disabled={currentPage >= totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                >
                    Sonraki
                    <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
