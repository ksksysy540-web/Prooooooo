"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollButton } from "@/components/scroll-button"

const slides = [
  {
    id: 1,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250813_225213.jpg-M6LWGttaXeuj7ZTNIjHRiyZncTiCcX.jpeg",
    headline: "Digital Products & E-books",
    subheadline: "Professional templates for businesses, coaches & content creators",
    badge: "Best Sellers",
    gradient: "from-amber-600/20 to-orange-600/20",
  },
  {
    id: 2,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250813_225253.jpg-xdCQkZgEBBsc9BjouN1oWxrNluNtLd.jpeg",
    headline: "Premium Audio Experience",
    subheadline: "Crystal clear sound with wireless headphones and accessories",
    badge: "New Arrivals",
    gradient: "from-slate-600/20 to-gray-600/20",
  },
  {
    id: 3,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250813_225539.jpg-tXs1GRBH3KxGHG3ewiKUFaoYTsyjx6.jpeg",
    headline: "Strong Hold Natural Finish",
    subheadline: "Professional styling products for the perfect look",
    badge: "Trending",
    gradient: "from-blue-600/20 to-cyan-600/20",
  },
  {
    id: 4,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250813_225501.jpg-XllQCvBMc8J1Fp0C5g4UZt0uwLIOrP.jpeg",
    headline: "Fashion & Style Essentials",
    subheadline: "Curated outfit collections for every occasion",
    badge: "Limited Offer",
    gradient: "from-rose-600/20 to-pink-600/20",
  },
  {
    id: 5,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250813_225323.jpg-kYkBd6IwRNn9tJ6l8s9aBSrfzN7icO.jpeg",
    headline: "Protein & Nutrition",
    subheadline: "Premium quality protein sources and health supplements",
    badge: "Health Focus",
    gradient: "from-green-600/20 to-emerald-600/20",
  },
  {
    id: 6,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250813_225418.jpg-kS2jQ4k2rUwnSJjLA2CVFhV2KYgjhZ.jpeg",
    headline: "Beauty & Skincare",
    subheadline: "Natural beauty products with refreshing summer vibes",
    badge: "Summer Special",
    gradient: "from-orange-600/20 to-red-600/20",
  },
  {
    id: 7,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250813_225523.jpg-uHxSTKxixnTFrx3xF0549eR56Bpgec.jpeg",
    headline: "Vintage Band Merchandise",
    subheadline: "Authentic vintage t-shirts and music memorabilia",
    badge: "Collector's Items",
    gradient: "from-purple-600/20 to-indigo-600/20",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, [currentSlide])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setIsAnimating(false)
    }, 300)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setIsAnimating(false)
    }, 300)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <section className="relative w-full aspect-[4/3] max-h-[70vh] overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          {/* Background Image with Parallax */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.headline}
              fill
              className={`object-cover transition-transform duration-[6000ms] ease-linear ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
              priority={index === 0}
            />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-float-slow" />
            <div className="absolute top-40 right-20 w-6 h-6 bg-primary/30 rounded-full animate-float-medium" />
            <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-accent/40 rounded-full animate-float-fast" />
            <ShoppingCart className="absolute top-1/3 right-1/3 w-8 h-8 text-white/10 animate-float-slow" />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ease-out ${
                  index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {index === currentSlide && (
                  <>
                    <Badge
                      className="mb-4 bg-accent text-accent-foreground animate-fade-in-up"
                      style={{ animationDelay: "0.2s" }}
                    >
                      {slide.badge}
                    </Badge>
                    <h1
                      className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in-up"
                      style={{ animationDelay: "0.4s" }}
                    >
                      {slide.headline}
                    </h1>
                    <p
                      className="text-lg md:text-xl text-white/90 mb-6 animate-fade-in-up"
                      style={{ animationDelay: "0.6s" }}
                    >
                      {slide.subheadline}
                    </p>
                    <div
                      className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
                      style={{ animationDelay: "0.8s" }}
                    >
                      <ScrollButton
                        targetId="products"
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Shop Now
                      </ScrollButton>
                      <ScrollButton
                        targetId="products"
                        variant="outline"
                        size="lg"
                        className="border-white text-white hover:bg-white hover:text-black bg-white/10 backdrop-blur-sm"
                      >
                        View Collection
                      </ScrollButton>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group"
        disabled={isAnimating}
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group"
        disabled={isAnimating}
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </section>
  )
}
