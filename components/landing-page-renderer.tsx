"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Star, Check, Shield, Clock, Users } from "lucide-react"

interface LandingPage {
  id: string
  product_name: string
  primary_affiliate_link: string
  target_audience: string | null
  affiliate_disclosure: string | null
  main_headline: string | null
  sub_headline: string | null
  hero_image_url: string | null
  hero_video_url: string | null
  primary_cta_text: string | null
  problem_headline: string | null
  problem_description: string | null
  solution_headline: string | null
  solution_description: string | null
  social_proof_headline: string | null
  offer_headline: string | null
  urgency_scarcity_text: string | null
  risk_reversal_guarantee: string | null
  final_cta_text: string | null
  faq_headline: string | null
}

interface Feature {
  id: string
  feature_icon: string | null
  feature_title: string
  benefit_description: string
  display_order: number
}

interface Testimonial {
  id: string
  customer_photo_url: string | null
  customer_name: string
  customer_location: string | null
  star_rating: number | null
  testimonial_quote: string
  display_order: number
}

interface FAQ {
  id: string
  question: string
  answer: string
  display_order: number
}

interface Props {
  landingPage: LandingPage
  features: Feature[]
  testimonials: Testimonial[]
  faqs: FAQ[]
}

const getIconComponent = (iconName: string | null) => {
  switch (iconName?.toLowerCase()) {
    case "check":
      return Check
    case "star":
      return Star
    case "shield":
      return Shield
    case "clock":
      return Clock
    case "users":
      return Users
    default:
      return Check
  }
}

export default function LandingPageRenderer({ landingPage, features, testimonials, faqs }: Props) {
  const handleCTAClick = () => {
    window.open(landingPage.primary_affiliate_link, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-lime-50 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {landingPage.main_headline && (
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  {landingPage.main_headline}
                </h1>
              )}

              {landingPage.sub_headline && (
                <p className="text-xl text-gray-700 leading-relaxed">{landingPage.sub_headline}</p>
              )}

              {landingPage.primary_cta_text && (
                <Button
                  onClick={handleCTAClick}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {landingPage.primary_cta_text}
                </Button>
              )}
            </div>

            <div className="flex justify-center">
              {landingPage.hero_image_url ? (
                <img
                  src={landingPage.hero_image_url || "/placeholder.svg"}
                  alt={landingPage.product_name}
                  className="max-w-full h-auto rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-green-100 to-lime-100 rounded-lg shadow-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-green-600 rounded-full mx-auto flex items-center justify-center">
                      <Star className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-green-800">{landingPage.product_name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      {(landingPage.problem_headline || landingPage.problem_description) && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            {landingPage.problem_headline && (
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{landingPage.problem_headline}</h2>
            )}

            {landingPage.problem_description && (
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                {landingPage.problem_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Solution Section */}
      {(landingPage.solution_headline || landingPage.solution_description) && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            {landingPage.solution_headline && (
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{landingPage.solution_headline}</h2>
            )}

            {landingPage.solution_description && (
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                {landingPage.solution_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-lime-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => {
                const IconComponent = getIconComponent(feature.feature_icon)
                return (
                  <Card key={feature.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-green-600 rounded-full mx-auto flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{feature.feature_title}</h3>
                      <p className="text-gray-700 leading-relaxed">{feature.benefit_description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            {landingPage.social_proof_headline && (
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-16">
                {landingPage.social_proof_headline}
              </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-0 shadow-lg">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: testimonial.star_rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <blockquote className="text-gray-700 leading-relaxed italic">
                      "{testimonial.testimonial_quote}"
                    </blockquote>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{testimonial.customer_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.customer_name}</p>
                        {testimonial.customer_location && (
                          <p className="text-sm text-gray-600">{testimonial.customer_location}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offer Section */}
      {(landingPage.offer_headline || landingPage.urgency_scarcity_text || landingPage.risk_reversal_guarantee) && (
        <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-lime-600 text-white">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            {landingPage.offer_headline && (
              <h2 className="text-3xl md:text-5xl font-bold">{landingPage.offer_headline}</h2>
            )}

            {landingPage.urgency_scarcity_text && (
              <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 px-6 py-2 text-lg font-semibold">
                {landingPage.urgency_scarcity_text}
              </Badge>
            )}

            {landingPage.risk_reversal_guarantee && (
              <div className="bg-white/10 rounded-lg p-8 backdrop-blur">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Shield className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Money-Back Guarantee</h3>
                </div>
                <p className="text-lg leading-relaxed">{landingPage.risk_reversal_guarantee}</p>
              </div>
            )}

            {landingPage.final_cta_text && (
              <Button
                onClick={handleCTAClick}
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-12 py-6 text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {landingPage.final_cta_text}
              </Button>
            )}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            {landingPage.faq_headline && (
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-16">
                {landingPage.faq_headline}
              </h2>
            )}

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 leading-relaxed pt-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Affiliate Disclosure */}
      {landingPage.affiliate_disclosure && (
        <section className="py-8 px-4 bg-gray-100 border-t">
          <div className="container mx-auto max-w-4xl">
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              <strong>Affiliate Disclosure:</strong> {landingPage.affiliate_disclosure}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
