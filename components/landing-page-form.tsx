"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Feature {
  id: string
  feature_icon: string
  feature_title: string
  benefit_description: string
}

interface Testimonial {
  id: string
  customer_name: string
  customer_location: string
  star_rating: number
  testimonial_quote: string
}

interface FAQ {
  id: string
  question: string
  answer: string
}

export default function LandingPageForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [features, setFeatures] = useState<Feature[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])

  const addFeature = () => {
    setFeatures([
      ...features,
      {
        id: crypto.randomUUID(),
        feature_icon: "",
        feature_title: "",
        benefit_description: "",
      },
    ])
  }

  const removeFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id))
  }

  const updateFeature = (id: string, field: keyof Feature, value: string) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const addTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        id: crypto.randomUUID(),
        customer_name: "",
        customer_location: "",
        star_rating: 5,
        testimonial_quote: "",
      },
    ])
  }

  const removeTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id))
  }

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  const addFAQ = () => {
    setFaqs([
      ...faqs,
      {
        id: crypto.randomUUID(),
        question: "",
        answer: "",
      },
    ])
  }

  const removeFAQ = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id))
  }

  const updateFAQ = (id: string, field: keyof FAQ, value: string) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Create slug from product name
      const productName = formData.get("product_name") as string
      const slug = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      // Insert landing page
      const { data: landingPage, error: pageError } = await supabase
        .from("landing_pages")
        .insert({
          user_id: user.id,
          product_name: formData.get("product_name"),
          primary_affiliate_link: formData.get("primary_affiliate_link"),
          target_audience: formData.get("target_audience"),
          affiliate_disclosure: formData.get("affiliate_disclosure"),
          main_headline: formData.get("main_headline"),
          sub_headline: formData.get("sub_headline"),
          hero_image_url: formData.get("hero_image_url"),
          hero_video_url: formData.get("hero_video_url"),
          primary_cta_text: formData.get("primary_cta_text"),
          problem_headline: formData.get("problem_headline"),
          problem_description: formData.get("problem_description"),
          solution_headline: formData.get("solution_headline"),
          solution_description: formData.get("solution_description"),
          social_proof_headline: formData.get("social_proof_headline"),
          offer_headline: formData.get("offer_headline"),
          urgency_scarcity_text: formData.get("urgency_scarcity_text"),
          risk_reversal_guarantee: formData.get("risk_reversal_guarantee"),
          final_cta_text: formData.get("final_cta_text"),
          faq_headline: formData.get("faq_headline"),
          slug,
          is_published: false,
        })
        .select()
        .single()

      if (pageError) throw pageError

      // Insert features
      if (features.length > 0) {
        const { error: featuresError } = await supabase.from("features").insert(
          features.map((feature, index) => ({
            landing_page_id: landingPage.id,
            feature_icon: feature.feature_icon,
            feature_title: feature.feature_title,
            benefit_description: feature.benefit_description,
            display_order: index + 1,
          })),
        )

        if (featuresError) throw featuresError
      }

      // Insert testimonials
      if (testimonials.length > 0) {
        const { error: testimonialsError } = await supabase.from("testimonials").insert(
          testimonials.map((testimonial, index) => ({
            landing_page_id: landingPage.id,
            customer_name: testimonial.customer_name,
            customer_location: testimonial.customer_location,
            star_rating: testimonial.star_rating,
            testimonial_quote: testimonial.testimonial_quote,
            display_order: index + 1,
          })),
        )

        if (testimonialsError) throw testimonialsError
      }

      // Insert FAQs
      if (faqs.length > 0) {
        const { error: faqsError } = await supabase.from("faqs").insert(
          faqs.map((faq, index) => ({
            landing_page_id: landingPage.id,
            question: faq.question,
            answer: faq.answer,
            display_order: index + 1,
          })),
        )

        if (faqsError) throw faqsError
      }

      router.push("/admin")
    } catch (error) {
      console.error("Error creating landing page:", error)
      alert("Error creating landing page. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Category 1: Global Page Settings */}
      <Card>
        <CardHeader>
          <CardTitle>1. Global Page Settings</CardTitle>
          <CardDescription>Define the core product and tracking for the entire page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product_name">Product Name *</Label>
            <Input id="product_name" name="product_name" placeholder="AuraSleep Smart Mattress" required />
            <p className="text-sm text-muted-foreground mt-1">
              Enter the official name of the affiliate product you are promoting.
            </p>
          </div>

          <div>
            <Label htmlFor="primary_affiliate_link">Primary Affiliate Link *</Label>
            <Input
              id="primary_affiliate_link"
              name="primary_affiliate_link"
              type="url"
              placeholder="https://product-site.com/buy?aff_id=12345"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter your full, unique affiliate link for the product. All main call-to-action buttons will use this
              link.
            </p>
          </div>

          <div>
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              name="target_audience"
              placeholder="Working professionals aged 30-50 who struggle with sleep due to stress and a busy lifestyle."
            />
            <p className="text-sm text-muted-foreground mt-1">
              In one sentence, describe the ideal customer for this product. This will help you keep your language
              focused.
            </p>
          </div>

          <div>
            <Label htmlFor="affiliate_disclosure">Affiliate Disclosure *</Label>
            <Textarea
              id="affiliate_disclosure"
              name="affiliate_disclosure"
              placeholder="Please note: This page contains affiliate links. If you make a purchase through these links, I may earn a small commission at no extra cost to you. I only recommend products I truly believe in."
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter your affiliate disclosure statement. This is legally required. Be transparent - this builds trust
              with your audience.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category 2: Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>2. Hero Section</CardTitle>
          <CardDescription>
            This is the first thing visitors see. It must grab their attention immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="main_headline">Main Headline *</Label>
            <Input
              id="main_headline"
              name="main_headline"
              placeholder="Get a Full Night's Rest Without Waking Up Tired and Groggy"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Write a powerful, benefit-driven headline. Focus on the primary result the customer will get. Formula:
              [Achieve a Desired Outcome] Without [Common Pain Point]
            </p>
          </div>

          <div>
            <Label htmlFor="sub_headline">Sub-headline</Label>
            <Textarea
              id="sub_headline"
              name="sub_headline"
              placeholder="Discover how the AuraSleep Smart Mattress uses AI-powered adjustments to give you deep, uninterrupted sleep every single night."
            />
            <p className="text-sm text-muted-foreground mt-1">
              Expand on the headline. Briefly explain how the product delivers the promised result or mention the key
              feature.
            </p>
          </div>

          <div>
            <Label htmlFor="hero_image_url">Hero Image URL</Label>
            <Input
              id="hero_image_url"
              name="hero_image_url"
              type="url"
              placeholder="https://example.com/hero-image.jpg"
            />
            <p className="text-sm text-muted-foreground mt-1">Upload a high-quality image of the product in use.</p>
          </div>

          <div>
            <Label htmlFor="hero_video_url">Hero Video URL</Label>
            <Input id="hero_video_url" name="hero_video_url" type="url" placeholder="https://vimeo.com/123456789" />
            <p className="text-sm text-muted-foreground mt-1">
              A short video showing the product's benefits is often more effective than an image.
            </p>
          </div>

          <div>
            <Label htmlFor="primary_cta_text">Primary Call-to-Action Button Text *</Label>
            <Input id="primary_cta_text" name="primary_cta_text" placeholder="Yes, I Want Better Sleep!" required />
            <p className="text-sm text-muted-foreground mt-1">
              Enter the text for the main button in this section. Use strong action words.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category 3: Problem & Agitation */}
      <Card>
        <CardHeader>
          <CardTitle>3. Problem & Agitation</CardTitle>
          <CardDescription>
            Connect with the visitor's pain points to show you understand their struggle.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="problem_headline">Problem Section Headline</Label>
            <Input
              id="problem_headline"
              name="problem_headline"
              placeholder="Still Waking Up Feeling Like You Haven't Slept at All?"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Write a headline that directly addresses the visitor's primary problem or asks a relatable question.
            </p>
          </div>

          <div>
            <Label htmlFor="problem_description">Problem Description</Label>
            <Textarea
              id="problem_description"
              name="problem_description"
              placeholder="Tossing and turning all night, staring at the ceiling, and dreading the sound of your alarm clock. You've tried everything from herbal teas to meditation apps, but nothing seems to stop the cycle of exhaustion. Poor sleep isn't just making you tired—it's ruining your focus, mood, and productivity."
              rows={4}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Describe the common frustrations and pain points your target audience experiences. Use emotional language
              to build a connection.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category 4: Solution & Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>4. Solution & Benefits</CardTitle>
          <CardDescription>Introduce the product as the solution and detail its benefits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="solution_headline">Solution Section Headline</Label>
            <Input
              id="solution_headline"
              name="solution_headline"
              placeholder="Introducing AuraSleep: The Last Sleep Solution You'll Ever Need"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Introduce the product as the ultimate solution to the problem you just described.
            </p>
          </div>

          <div>
            <Label htmlFor="solution_description">Solution Description</Label>
            <Textarea
              id="solution_description"
              name="solution_description"
              placeholder="AuraSleep isn't just a mattress; it's a personalized sleep ecosystem. It intelligently tracks your sleep cycles and makes micro-adjustments to temperature and firmness in real-time, guiding you into deeper, more restorative sleep."
              rows={3}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Briefly explain how the product works and how it solves the core problem.
            </p>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-semibold">Features & Benefits</Label>
              <Button type="button" onClick={addFeature} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>

            {features.map((feature, index) => (
              <Card key={feature.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium">Feature {index + 1}</span>
                  <Button type="button" onClick={() => removeFeature(feature.id)} variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Feature Icon (optional)</Label>
                    <Input
                      placeholder="check, star, thermometer, etc."
                      value={feature.feature_icon}
                      onChange={(e) => updateFeature(feature.id, "feature_icon", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Feature Title *</Label>
                    <Input
                      placeholder="AI-Powered Firmness Adjustment"
                      value={feature.feature_title}
                      onChange={(e) => updateFeature(feature.id, "feature_title", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Benefit Description *</Label>
                    <Textarea
                      placeholder="Never wake up with a sore back again. The mattress adapts to your sleeping position to provide perfect spinal alignment and pressure relief all night long."
                      value={feature.benefit_description}
                      onChange={(e) => updateFeature(feature.id, "benefit_description", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </Card>
            ))}

            {features.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No features added yet. Click "Add Feature" to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category 5: Social Proof & Trust */}
      <Card>
        <CardHeader>
          <CardTitle>5. Social Proof & Trust</CardTitle>
          <CardDescription>Build credibility with testimonials, reviews, and endorsements.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="social_proof_headline">Social Proof Headline</Label>
            <Input
              id="social_proof_headline"
              name="social_proof_headline"
              placeholder="See What Our Happy Customers Are Saying..."
            />
            <p className="text-sm text-muted-foreground mt-1">Write a headline to introduce your testimonials.</p>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-semibold">Testimonials</Label>
              <Button type="button" onClick={addTestimonial} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium">Testimonial {index + 1}</span>
                  <Button type="button" onClick={() => removeTestimonial(testimonial.id)} variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Customer Name *</Label>
                    <Input
                      placeholder="Sarah J."
                      value={testimonial.customer_name}
                      onChange={(e) => updateTestimonial(testimonial.id, "customer_name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Customer Location</Label>
                    <Input
                      placeholder="San Diego, CA"
                      value={testimonial.customer_location}
                      onChange={(e) => updateTestimonial(testimonial.id, "customer_location", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Star Rating (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.star_rating}
                      onChange={(e) =>
                        updateTestimonial(testimonial.id, "star_rating", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Testimonial Quote *</Label>
                    <Textarea
                      placeholder="I haven't slept this well in years. The AuraSleep mattress was a game-changer for my energy levels. I can't recommend it enough!"
                      value={testimonial.testimonial_quote}
                      onChange={(e) => updateTestimonial(testimonial.id, "testimonial_quote", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </Card>
            ))}

            {testimonials.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No testimonials added yet. Click "Add Testimonial" to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category 6: The Offer & Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle>6. The Offer & Call to Action</CardTitle>
          <CardDescription>Make an irresistible offer and create a sense of urgency.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="offer_headline">Offer Headline</Label>
            <Input
              id="offer_headline"
              name="offer_headline"
              placeholder="Get 40% OFF Your AuraSleep Smart Mattress Today + Free Shipping!"
            />
            <p className="text-sm text-muted-foreground mt-1">Clearly state the main offer or discount.</p>
          </div>

          <div>
            <Label htmlFor="urgency_scarcity_text">Urgency/Scarcity (Optional)</Label>
            <Input
              id="urgency_scarcity_text"
              name="urgency_scarcity_text"
              placeholder="This special launch offer ends in: [Countdown Timer] or Limited to the first 100 buyers only!"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Add a statement to encourage immediate action. This is optional but highly effective.
            </p>
          </div>

          <div>
            <Label htmlFor="risk_reversal_guarantee">Risk Reversal / Guarantee</Label>
            <Textarea
              id="risk_reversal_guarantee"
              name="risk_reversal_guarantee"
              placeholder="Your purchase is protected by our 100-Night Risk-Free Trial. If you don't have the best sleep of your life, we'll give you a full refund."
            />
            <p className="text-sm text-muted-foreground mt-1">
              State the money-back guarantee to remove any purchase risk for the customer.
            </p>
          </div>

          <div>
            <Label htmlFor="final_cta_text">Final CTA Button Text</Label>
            <Input id="final_cta_text" name="final_cta_text" placeholder="Claim My 40% Discount Now" />
            <p className="text-sm text-muted-foreground mt-1">
              Enter the text for the final, primary call-to-action button.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category 7: FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>7. FAQ Section</CardTitle>
          <CardDescription>Address common questions and overcome last-minute objections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="faq_headline">FAQ Headline</Label>
            <Input id="faq_headline" name="faq_headline" placeholder="Got Questions? We Have Answers." />
            <p className="text-sm text-muted-foreground mt-1">
              Enter the headline for the Frequently Asked Questions section.
            </p>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-semibold">FAQ Items</Label>
              <Button type="button" onClick={addFAQ} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </div>

            {faqs.map((faq, index) => (
              <Card key={faq.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium">FAQ {index + 1}</span>
                  <Button type="button" onClick={() => removeFAQ(faq.id)} variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Question *</Label>
                    <Input
                      placeholder="How does the 100-night trial work?"
                      value={faq.question}
                      onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Answer *</Label>
                    <Textarea
                      placeholder="From the day your mattress is delivered, you have 100 nights to try it out. If you're not completely satisfied for any reason, contact us for a full refund and we'll even arrange for pickup."
                      value={faq.answer}
                      onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </Card>
            ))}

            {faqs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No FAQs added yet. Click "Add FAQ" to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center gap-4 pt-8">
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 px-8">
          {loading ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Landing Page
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
