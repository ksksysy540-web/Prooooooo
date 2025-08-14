import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LandingPageForm from "@/components/landing-page-form"

export default async function CreatePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Create New Landing Page</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <LandingPageForm />
      </main>
    </div>
  )
}
