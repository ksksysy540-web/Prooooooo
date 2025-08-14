import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, ShoppingCart } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          Sorry, we couldn't find the product you're looking for. It may have been removed or the link is incorrect.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
