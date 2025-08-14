import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import LandingPageRenderer from "@/components/landing-page-renderer"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient()

  const { data: landingPage } = await supabase
    .from("landing_pages")
    .select("product_name, main_headline, sub_headline")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single()

  if (!landingPage) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: `${landingPage.product_name} - ${landingPage.main_headline}`,
    description: landingPage.sub_headline || `Learn more about ${landingPage.product_name}`,
  }
}

export default async function LandingPage({ params }: PageProps) {
  const supabase = createClient()

  // Fetch landing page data
  const { data: landingPage, error: pageError } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
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
    <LandingPageRenderer
      landingPage={landingPage}
      features={features || []}
      testimonials={testimonials || []}
      faqs={faqs || []}
    />
  )
}
