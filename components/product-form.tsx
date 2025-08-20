"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createProduct, updateProduct } from "@/lib/actions"
import MultiImageUpload from "./multi-image-upload"

const defaultCategories: Array<{ id: string; name: string; slug: string }> = [
  { id: "all", name: "All", slug: "all" },
  { id: "electronics", name: "Electronics", slug: "electronics" },
  { id: "fashion", name: "Fashion", slug: "fashion" },
  { id: "beauty", name: "Beauty", slug: "beauty" },
  { id: "home-garden", name: "Home & Garden", slug: "home-garden" },
]

const defaultCategories: Array<{ id: string; name: string; slug: string }> = [
  { id: "all", name: "All", slug: "all" },
  { id: "electronics", name: "Electronics", slug: "electronics" },
  { id: "fashion", name: "Fashion", slug: "fashion" },
  { id: "beauty", name: "Beauty", slug: "beauty" },
  { id: "home-garden", name: "Home & Garden", slug: "home-garden" },
]

interface Product {
  id: string
  product_name: string
  description: string
  price: number
  discount?: number
  badge?: string
  affiliate_link: string
  image_url: string
  category?: string
}

interface ProductFormProps {
  product?: Product
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Updating..." : "Creating..."}
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "Update Product" : "Create Product"}
        </>
      )}
    </Button>
  )
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product
  const action = isEditing ? updateProduct : createProduct
  const [state, formAction] = useActionState(action, null)
  const [imageUrl, setImageUrl] = useState(product?.image_url || "")
  const [selectedBadge, setSelectedBadge] = useState(product?.badge || "No Badge")
  const [selectedCategory, setSelectedCategory] = useState(product?.category || "")
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>(defaultCategories)

  useEffect(() => {
    if (state?.success) {
      router.push("/admin")
    }
  }, [state, router])

  useEffect(() => {
    let ignore = false
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!ignore && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories)
        }
      } catch {}
    }
    loadCategories()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update your product information" : "Fill in the details for your new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {isEditing && <input type="hidden" name="id" value={product!.id} />}
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded">
              {state.success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="product_name" className="block text-sm font-medium">
                Product Name *
              </label>
              <Input
                id="product_name"
                name="product_name"
                type="text"
                placeholder="Enter product name"
                defaultValue={product?.product_name || ""}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium">
                Price *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={product?.price || ""}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="discount" className="block text-sm font-medium">
                Discount (%)
              </label>
              <Input
                id="discount"
                name="discount"
                type="number"
                step="1"
                min="0"
                max="100"
                placeholder="0"
                defaultValue={product?.discount || ""}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="badge" className="block text-sm font-medium">
                Product Badge
              </label>
              <Select name="badge" value={selectedBadge} onValueChange={setSelectedBadge}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a badge (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No Badge">No Badge</SelectItem>
                  <SelectItem value="trending">🔥 Trending</SelectItem>
                  <SelectItem value="limited-offer">⏰ Limited Offer</SelectItem>
                  <SelectItem value="best-seller">⭐ Best Seller</SelectItem>
                  <SelectItem value="new-arrival">✨ New Arrival</SelectItem>
                  <SelectItem value="featured">👑 Featured</SelectItem>
                  <SelectItem value="sale">💰 Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              defaultValue={product?.description || ""}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="affiliate_link" className="block text-sm font-medium">
              Affiliate Link
            </label>
            <Input
              id="affiliate_link"
              name="affiliate_link"
              type="url"
              placeholder="https://example.com/affiliate-link"
              defaultValue={product?.affiliate_link || ""}
            />
          </div>

          <MultiImageUpload initialUrls={product?.image_url ? [product.image_url] : []} />

          <div className="flex gap-4">
            <SubmitButton isEditing={isEditing} />
            <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

