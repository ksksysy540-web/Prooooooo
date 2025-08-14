import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DemoPage() {
  const supabase = createClient()

  // Find the first published landing page to use as demo
  const { data: demoPage } = await supabase
    .from("landing_pages")
    .select("slug")
    .eq("is_published", true)
    .limit(1)
    .single()

  if (demoPage) {
    redirect(`/page/${demoPage.slug}`)
  }

  // If no demo page exists, show a message
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">Demo Not Available</h1>
        <p className="text-muted-foreground">
          No published landing pages are available for demo. Please create and publish a landing page first.
        </p>
      </div>
    </div>
  )
}
