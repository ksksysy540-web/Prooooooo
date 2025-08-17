"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface ImageUploadProps {
  currentImages?: string[]
  onImagesChange: (urls: string[]) => void
}

export default function ImageUpload({ currentImages = [], onImagesChange }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>(currentImages)

  useEffect(() => {
    if (files.length === 0) return
    const objectUrls = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...objectUrls])

    return () => objectUrls.forEach(url => URL.revokeObjectURL(url))
  }, [files])

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles(prev => [...prev, ...Array.from(e.target.files)])
  }

  const handleUpload = async () => {
    const uploadedUrls: string[] = []
    for (let file of files) {
      const fileName = `${Date.now()}_${file.name}`
      const { error } = await supabase.storage.from("products").upload(fileName, file)
      if (!error) {
        const { publicUrl } = supabase.storage.from("products").getPublicUrl(fileName)
        uploadedUrls.push(publicUrl)
      }
    }
    onImagesChange(uploadedUrls)
    setFiles([])
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Product Images</label>
      <input type="file" multiple onChange={handleFilesChange} />
      <div className="flex gap-2 flex-wrap mt-2">
        {previews.map((src, idx) => (
          <img key={idx} src={src} className="w-24 h-24 object-cover rounded" />
        ))}
      </div>
      {files.length > 0 && (
        <button type="button" className="mt-2 px-4 py-2 bg-primary text-white rounded" onClick={handleUpload}>
          Upload Images
        </button>
      )}
    </div>
  )
}