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
  currentImageUrls?: string[]
  onImagesChange: (urls: string[]) => void
}

export default function ImageUpload({ currentImageUrls = [], onImagesChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>(currentImageUrls)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState("")

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setError("")
    setIsUploading(true)

    try {
      const newUrls = [...previewUrls]
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Create preview
        const previewUrl = URL.createObjectURL(file)
        newUrls.push(previewUrl)
        setPreviewUrls([...newUrls])

        // Upload file
        const formData = new FormData()
        formData.append("file", file)

        const result = await uploadImage(formData)
        if (result.error) {
          throw new Error(result.error)
        } else if (result.url) {
          // Replace the preview URL with the actual uploaded URL
          const index = newUrls.indexOf(previewUrl)
          if (index !== -1) {
            newUrls[index] = result.url
            setPreviewUrls([...newUrls])
          }
        }
      }

      onImagesChange(newUrls.filter(url => !url.startsWith('blob:'))) // Remove any blob URLs
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload images")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const newUrls = [...previewUrls]
    newUrls.splice(index, 1)
    setPreviewUrls(newUrls)
    onImagesChange(newUrls)
  }

  const handleAddUrl = () => {
    if (urlInput.trim() && !previewUrls.includes(urlInput)) {
      const newUrls = [...previewUrls, urlInput]
      setPreviewUrls(newUrls)
      onImagesChange(newUrls)
      setUrlInput("")
      setError("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Product Images</label>
        <p className="text-xs text-muted-foreground">Upload images or enter URLs</p>
      </div>

      {/* Images Preview */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewUrls.map((url, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-4">
                <div className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Product preview ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    onError={() => {
                      // Handle broken images
                      const newUrls = [...previewUrls]
                      newUrls.splice(index, 1)
                      setPreviewUrls(newUrls)
                      onImagesChange(newUrls)
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
              Upload Images
            </>
          )}
        </Button>
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          onChange={handleFileSelect} 
          className="hidden" 
          multiple 
        />
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
          >
            Add URL
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Hidden inputs for form submission */}
      {previewUrls.map((url, index) => (
        <input key={index} type="hidden" name="image_urls" value={url} />
      ))}
    </div>
  )
}