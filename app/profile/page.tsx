import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, ShoppingBag, MessageCircle, Heart, Gift, ExternalLink, QrCode } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CopyButton } from "@/components/copy-button"

// Generate random UID
function generateUID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export default async function ProfilePage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get total products count
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const userUID = generateUID()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">SwiftMart</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white/20 animate-pulse hover:animate-none transition-all duration-300">
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                  <p className="text-white/90 text-lg">{user.email}</p>
                  <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                    UID: {userUID}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">Available in store</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {new Date(user.created_at || "").toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground">Join date</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Admin Section */}
          <Card id="contact" className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Admin
              </CardTitle>
              <CardDescription>Get in touch with our admin team through social media</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="justify-start h-auto p-4 hover:scale-105 transition-all duration-200 bg-transparent"
                  asChild
                >
                  <Link href="https://pin.it/3jHxrZPrn" target="_blank" className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <span className="font-medium">Pinterest</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start h-auto p-4 hover:scale-105 transition-all duration-200 bg-transparent"
                  asChild
                >
                  <Link href="https://t.me/imFINISHER" target="_blank" className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <span className="font-medium">Telegram</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start h-auto p-4 hover:scale-105 transition-all duration-200 bg-transparent"
                  asChild
                >
                  <Link
                    href="https://www.instagram.com/smile_issunaah?igsh=MWR5aWxoejh1NzAxNA=="
                    target="_blank"
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">I</span>
                    </div>
                    <span className="font-medium">Instagram</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Donation Section */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Gift className="h-5 w-5" />
                Support Our Work
              </CardTitle>
              <CardDescription className="text-orange-600">
                Help us maintain and improve SwiftMart with a USDT donation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-orange-700">USDT Address (TRC20)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-white p-2 rounded border text-xs break-all flex-1">
                        TFKGm4YPEJHw733GRGz3mTAVjhDPQjmcpt
                      </code>
                      <CopyButton text="TFKGm4YPEJHw733GRGz3mTAVjhDPQjmcpt" />
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 animate-pulse hover:animate-none transition-all duration-300">
                    <Heart className="h-4 w-4 mr-2" />
                    Donate Now
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white p-4 rounded-lg border-2 border-orange-200 hover:scale-105 transition-all duration-300">
                    <Image
                      src="https://envs.sh/2bN.jpg"
                      alt="USDT Donation QR Code"
                      width={150}
                      height={150}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-orange-600">
                    <QrCode className="h-4 w-4" />
                    Scan QR Code
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
