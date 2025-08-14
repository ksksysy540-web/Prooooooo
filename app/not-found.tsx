import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileX, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <FileX className="h-24 w-24 text-muted-foreground mx-auto" />
          <h1 className="text-4xl font-bold text-primary">Page Not Found</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            The landing page you're looking for doesn't exist or hasn't been published yet.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
