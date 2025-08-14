import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import EditLandingPageForm from "@/components/edit-landing-page-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditPage({ params }: PageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch landing page data
  const { data: landingPage, error: pageError } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (pageError || !landingPage) {
    notFound()
  }

  // Fetch related data
  const [{ data: features }, { data: testimonials }, { data: faqs }] = await Promise.all([
    supabase.from("features").select("*").eq("landing_page_id", landingPage.id).order("display_order"),
    supabase.from("testimonials").select("*").eq("landing_page_id", landingPage.id).order("display_order"),
    supabase.from("faqs").select("*").eq("landing_page_id", landingPage.id).order("display_order"),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Edit Landing Page</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <EditLandingPageForm
          landingPage={landingPage}
          initialFeatures={features || []}
          initialTestimonials={testimonials || []}
          initialFaqs={faqs || []}
        />
      </main>
    </div>
  )
}
