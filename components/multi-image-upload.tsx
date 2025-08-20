"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Trash2, Upload } from "lucide-react"
import { uploadImage } from "@/lib/actions"

interface MultiImageUploadProps {
  initialUrls?: string[]
}

export default function MultiImageUpload({ initialUrls = [] }: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [urls, setUrls] = useState<string[]>(initialUrls)
  const [manualUrl, setManualUrl] = useState("")

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    const newUrls: string[] = []
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        const result = await uploadImage(formData)
        if (result?.url) newUrls.push(result.url)
      }
      if (newUrls.length > 0) setUrls((prev) => [...prev, ...newUrls])
    } finally {
      setIsUploading(false)
    }
  }

  const removeAt = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const addManual = () => {
    const u = manualUrl.trim()
    if (!u) return
    setUrls((prev) => [...prev, u])
    setManualUrl("")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Product Images (Multiple)</label>
        <p className="text-xs text-muted-foreground">Upload multiple images or paste direct image URLs</p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" /> Upload Images
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex-1 flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={addManual} disabled={!manualUrl.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {urls.map((u, idx) => (
            <Card key={`${u}-${idx}`} className="relative">
              <CardContent className="p-2">
                <div className="relative">
                  <Image src={u || "/placeholder.svg"} alt={`Product ${idx + 1}`} width={300} height={200} className="w-full h-32 object-cover rounded" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeAt(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Hidden inputs for form submit: first becomes primary */}
      <input type="hidden" name="image_url" value={urls[0] || ""} />
      {urls.map((u, i) => (
        <input key={`${u}-${i}`} type="hidden" name="image_urls[]" value={u} />
      ))}
    </div>
  )
}

