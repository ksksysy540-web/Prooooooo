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
import ImageUpload from "./image-upload"

interface Product {
  id: string
  product_name: string
  description: string
  price: number
  discount?: number
  badge?: string
  affiliate_link: string
  image_urls: string[] // Changed from image_url to image_urls
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
  const [imageUrls, setImageUrls] = useState<string[]>(product?.image_urls || [])
  const [selectedBadge, setSelectedBadge] = useState(product?.badge || "No Badge")

  useEffect(() => {
    if (state?.success) {
      router.push("/admin")
    }
  }, [state, router])

  const handleImageUpload = (url: string) => {
    setImageUrls(prev => [...prev, url])
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

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
          {isEditing && <input type="hidden" name="id" value={product.id} />}
          
          {/* Hidden input to send all image URLs */}
          {imageUrls.map((url, index) => (
            <input key={index} type="hidden" name="image_urls" value={url} />
          ))}
          
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

          {/* Multiple Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium">Product Images</label>
            <ImageUpload onImageUpload={handleImageUpload} />
            
            {/* Display uploaded images */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Product preview ${index + 1}`} 
                    className="rounded-md object-cover h-32 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

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