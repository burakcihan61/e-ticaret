"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Banner {
    id: string
    title: string
    subtitle: string | null
    image: string
    link: string | null
    buttonText: string | null
}

interface BannerSliderProps {
    banners: Banner[]
}

export default function BannerSlider({ banners }: BannerSliderProps) {
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const next = useCallback(() => {
        setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, [banners.length])

    const prev = useCallback(() => {
        setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
    }, [banners.length])

    useEffect(() => {
        if (!isPaused) {
            const timer = setInterval(next, 5000)
            return () => clearInterval(timer)
        }
    }, [next, isPaused])

    if (!banners || banners.length === 0) return null

    return (
        <section
            className="bg-muted group relative h-[500px] w-full overflow-hidden md:h-[600px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            <div className="relative h-full w-full">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={cn(
                            "absolute inset-0 h-full w-full transform transition-all duration-1000 ease-in-out",
                            index === current
                                ? "z-10 translate-x-0 opacity-100"
                                : "z-0 translate-x-full opacity-0"
                        )}
                    >
                        {/* Background Image with Gradient Overlay */}
                        <div className="absolute inset-0">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="h-full w-full scale-105 object-cover object-center transition-transform duration-[10s] ease-linear"
                                style={{
                                    transform: index === current ? "scale(1)" : "scale(1.1)",
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="container relative mx-auto flex h-full flex-col justify-center px-4 text-white">
                            <div
                                className={cn(
                                    "max-w-2xl transition-all delay-300 duration-700",
                                    index === current
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-10 opacity-0"
                                )}
                            >
                                <h1 className="mb-4 text-4xl font-extrabold uppercase tracking-tight drop-shadow-lg md:text-6xl">
                                    {banner.title}
                                </h1>
                                {banner.subtitle && (
                                    <p className="mb-8 max-w-lg text-lg text-white/90 drop-shadow md:text-xl">
                                        {banner.subtitle}
                                    </p>
                                )}
                                {banner.link && (
                                    <div className="flex gap-4">
                                        <Button
                                            size="lg"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground group/btn rounded-full px-8 shadow-xl"
                                            asChild
                                        >
                                            <Link href={banner.link}>
                                                {banner.buttonText || "Hemen İncele"}
                                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white opacity-0 backdrop-blur-md transition-all hover:bg-white/20 group-hover:opacity-100 sm:block"
                        aria-label="Önceki"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white opacity-0 backdrop-blur-md transition-all hover:bg-white/20 group-hover:opacity-100 sm:block"
                        aria-label="Sonraki"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Navigation Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 space-x-3">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={cn(
                                "h-1.5 rounded-full transition-all",
                                index === current
                                    ? "bg-primary w-8 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                    : "w-2 bg-white/40 hover:bg-white/60"
                            )}
                            aria-label={`${index + 1}. banner`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
