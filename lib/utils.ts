import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify"
import { nanoid } from "nanoid"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(
    price: number | string,
    options: {
        currency?: string
        notation?: Intl.NumberFormatOptions["notation"]
    } = {}
) {
    const { currency = "TRY", notation = "standard" } = options

    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency,
        notation,
    }).format(Number(price))
}

export function generateSlug(text: string): string {
    return slugify(text, {
        lower: true,
        strict: true,
        locale: "tr",
    })
}

export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = nanoid(6).toUpperCase()
    return `ORD-${timestamp}-${random}`
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date))
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str
    return str.slice(0, length) + "..."
}

export function calculateDiscount(price: number, comparePrice: number): number {
    if (!comparePrice || comparePrice <= price) return 0
    return Math.round(((comparePrice - price) / comparePrice) * 100)
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+90|0)?[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
}
