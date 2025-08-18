"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { uploadImage } from "@/lib/actions"

interface ImageUploadProps {
  currentImageUrl?: string
  onImageChange: (url: string) => void
}

export default function ImageUpload({ currentImageUrl, onImageChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError("")
    setIsUploading(true)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    const formData = new FormData()
    formData.append("file", file)

    try {
      const result = await uploadImage(formData)
      if (result.error) {
        setError(result.error)
        setPreviewUrl(currentImageUrl || "")
      } else if (result.url) {
        setPreviewUrl(result.url)
        onImageChange(result.url)
      }
    } catch (error) {
      setError("Failed to upload image")
      setPreviewUrl(currentImageUrl || "")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl("")
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url)
    onImageChange(url)
    setError("")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Product Image</label>
        <p className="text-xs text-muted-foreground">Upload an image or enter a URL</p>
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Product preview"
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <label htmlFor="image_url_input" className="block text-sm font-medium">
          Or enter image URL
        </label>
        <Input
          id="image_url_input"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={previewUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name="image_url" value={previewUrl} />
    </div>
  )
}