"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Share2 } from "lucide-react"

interface ShareButtonProps {
  url: string
  label?: string
}

export default function ShareButton({ url, label = "Share" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      // noop
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy} className="bg-transparent">
        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
        {copied ? "Copied!" : label}
      </Button>
      {/* Optional quick share links */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline hover:opacity-80"
      >
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline hover:opacity-80"
      >
        Telegram
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline hover:opacity-80"
      >
        Twitter
      </a>
    </div>
  )
}

