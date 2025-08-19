import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import ProductImageCarousel from "@/components/product-image-carousel"
import { Star, ShoppingCart, Search, Filter, X, Zap, Clock, TrendingUp } from "lucide-react"
import { ScrollButton } from "@/components/scroll-button"
import { AnimatedLogo } from "@/components/animated-logo"
import { HeroSlider } from "@/components/hero-slider"
import { trackProductClick } from "@/lib/actions"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Selected category from URL (e.g., ?category=electronics)
  const selectedCategory =
    typeof searchParams?.["category"] === "string" ? (searchParams?.["category"] as string) : undefined

  // Fetch products from database with optional category filter
  let productsQuery = supabase
    .from("products")
    .select("*, product_images:product_images(image_url, sort_order)")
    .order("created_at", { ascending: false })
  if (selectedCategory && selectedCategory !== "all") {
    productsQuery = productsQuery.eq("category", selectedCategory)
  }
  const { data: products, error } = await productsQuery

  if (error) {
    console.error("Error fetching products:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <AnimatedLogo />
          <div className="flex items-center gap-4">
            {user ? (
              <UserProfileDropdown user={user} />
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSlider />

      {/* Products Grid with Filter System */}
      <section id="products" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Best Sellers</h2>
            <p className="text-lg text-muted-foreground">Discover products that our customers love most</p>
          </div>

          <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`${!selectedCategory || selectedCategory === "all" ? "bg-primary text-primary-foreground" : ""}`}
                  asChild
                >
                  <Link href="/?category=all">All Products</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${selectedCategory === "electronics" ? "bg-primary text-primary-foreground" : ""}`}
                  asChild
                >
                  <Link href="/?category=electronics">
                    <Filter className="w-4 h-4 mr-2" /> Electronics
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${selectedCategory === "fashion" ? "bg-primary text-primary-foreground" : ""}`}
                  asChild
                >
                  <Link href="/?category=fashion">
                    <Filter className="w-4 h-4 mr-2" /> Fashion
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${selectedCategory === "beauty" ? "bg-primary text-primary-foreground" : ""}`}
                  asChild
                >
                  <Link href="/?category=beauty">
                    <Filter className="w-4 h-4 mr-2" /> Beauty
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${selectedCategory === "home-garden" ? "bg-primary text-primary-foreground" : ""}`}
                  asChild
                >
                  <Link href="/?category=home-garden">
                    <Filter className="w-4 h-4 mr-2" /> Home & Garden
                  </Link>
                </Button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Best Selling</option>
                  <option>Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                {(() => {
                  const map: Record<string, string> = {
                    all: "All Products",
                    electronics: "Electronics",
                    fashion: "Fashion",
                    beauty: "Beauty",
                    "home-garden": "Home & Garden",
                  }
                  const key = selectedCategory || "all"
                  return map[key] || "All Products"
                })()}
                <X className="w-3 h-3 cursor-pointer" />
              </Badge>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
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
                    width={250}
                    height={250}
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.badge && (
                      <Badge
                        className={`text-xs font-bold ${
                          product.badge === "Best Seller"
                            ? "bg-yellow-500 text-yellow-50"
                            : product.badge === "Trending"
                              ? "bg-red-500 text-red-50 animate-pulse"
                              : product.badge === "Limited Offer"
                                ? "bg-orange-500 text-orange-50"
                                : product.badge === "New Arrival"
                                  ? "bg-green-500 text-green-50"
                                  : "bg-blue-500 text-blue-50"
                        }`}
                      >
                        {product.badge === "Trending" && <TrendingUp className="w-3 h-3 mr-1" />}
                        {product.badge}
                      </Badge>
                    )}
                    {product.discount && product.discount > 0 && (
                      <Badge className="bg-red-600 text-white text-xs font-bold animate-bounce">
                        -{product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  {product.click_count && product.click_count > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {product.click_count} views
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.product_name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">(4.8)</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      {product.discount && product.discount > 0 ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through">${product.price}</span>
                          <span className="text-2xl font-bold text-primary">
                            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </span>
                          <span className="text-xs text-green-600 font-semibold">
                            You save ${(product.price * (product.discount / 100)).toFixed(2)}!
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                      )}
                    </div>
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      <Clock className="w-3 h-3 mr-1" />
                      Limited Stock
                    </Badge>
                  </div>
                  <form
                    action={async () => {
                      "use server"
                      await trackProductClick(product.id)
                    }}
                  >
                    <Button
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transform hover:scale-105 transition-all duration-200"
                      asChild
                    >
                      <Link href={`/product/${product.id}`}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience Premium Quality?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ScrollButton
              targetId="products"
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 animate-pulse hover:animate-none transform hover:scale-105 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <Zap className="w-4 h-4 mr-1" />
              Start Shopping Now
            </ScrollButton>
            <ScrollButton
              targetId="products"
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent transform hover:scale-105 transition-all duration-200"
            >
              View All Products
            </ScrollButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">© 2024 SwiftMart. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">
            30-day money-back guarantee • Free shipping on orders over $50 • 24/7 customer support
          </p>
        </div>
      </footer>
    </div>
  )
}
