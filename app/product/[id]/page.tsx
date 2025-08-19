import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import ProductImageCarousel from "@/components/product-image-carousel"
import { Star, ShoppingCart, Clock, Shield, Truck, RefreshCw, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient()

  // Resolve by UUID or slug
  let { data: product, error } = await supabase
    .from("products")
    .select("*, product_images:product_images(image_url, sort_order)")
    .eq("id", params.id)
    .single()
  if (error) {
    const { data: bySlug } = await supabase
      .from("products")
      .select("*, product_images:product_images(image_url, sort_order)")
      .eq("slug", params.id)
      .single()
    product = bySlug as any
    error = null as any
  }

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-primary">PremiumStore</h1>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                <ProductImageCarousel
                  images={[
                    ...(product.product_images?.sort?.
                      ? product.product_images.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                      : (product.product_images || [])),
                  ].map((p: any) => p.image_url).filter(Boolean).length > 0
                    ? (product.product_images || [])
                        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        .map((p: any) => p.image_url)
                    : [product.image_url]}
                  width={500}
                  height={500}
                  intervalMs={3500}
                />
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  Limited Time!
                </Badge>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-2 bg-primary/10 text-primary">Best Seller</Badge>
                <h1 className="text-4xl font-bold mb-4">{product.product_name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">(4.8/5 from 2,847 reviews)</span>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Price and Urgency */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-primary">${product.price}</span>
                  <Badge variant="destructive" className="text-sm">
                    Only 3 Left in Stock!
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Sale ends in: 2 days, 14 hours, 23 minutes</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Why Choose This Product?</h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Premium quality materials and construction</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-primary" />
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-primary" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-primary" />
                    <span>Rated #1 by customers</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6"
                  asChild
                >
                  <Link href={product.affiliate_link || "#"} target="_blank">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy Now - Limited Stock!
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  asChild
                >
                  <Link href={product.affiliate_link || "#"} target="_blank">
                    Get Best Deal
                  </Link>
                </Button>
              </div>

              {/* Guarantee */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-bold">100% Satisfaction Guarantee</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Not completely satisfied? Return it within 30 days for a full refund. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Customers Are Saying</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Jennifer M.",
                location: "Seattle, WA",
                rating: 5,
                text: "Absolutely love this product! Quality is outstanding and it arrived faster than expected. Will definitely order again!",
              },
              {
                name: "David R.",
                location: "Austin, TX",
                rating: 5,
                text: "Best purchase I've made this year. The quality exceeded my expectations and customer service was fantastic.",
              },
              {
                name: "Lisa K.",
                location: "Miami, FL",
                rating: 5,
                text: "I was hesitant to order online, but this product is exactly as described. Highly recommend to anyone!",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Out - Limited Stock Available!</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of satisfied customers who chose quality.</p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link href={product.affiliate_link || "#"} target="_blank">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Secure Your Order Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
