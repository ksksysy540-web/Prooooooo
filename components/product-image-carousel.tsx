"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductImageCarouselProps {
  images: string[]
  width?: number
  height?: number
  intervalMs?: number
}

export default function ProductImageCarousel({ images, width = 250, height = 250, intervalMs = 3500 }: ProductImageCarouselProps) {
  const validImages = useMemo(() => images.filter(Boolean), [images])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (validImages.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % validImages.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [validImages.length, intervalMs])

  if (validImages.length === 0) {
    return (
      <Image
        src={"/placeholder.svg?height=" + height + "&width=" + width}
        alt="Product"
        width={width}
        height={height}
        className="w-full h-48 object-cover"
      />
    )
  }

  const goPrev = () => setIndex((i) => (i - 1 + validImages.length) % validImages.length)
  const goNext = () => setIndex((i) => (i + 1) % validImages.length)

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        {validImages.map((src, i) => (
          <Image
            key={`${src}-${i}`}
            src={src}
            alt={`Product ${i + 1}`}
            width={width}
            height={height}
            className={`w-full h-48 object-cover transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0 absolute inset-0"}`}
          />
        ))}
      </div>
      {validImages.length > 1 && (
        <>
          <Button type="button" variant="secondary" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={goPrev}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button type="button" variant="secondary" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={goNext}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}
    </div>
  )
}

