import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function setupDatabase() {
  "use server"

  const supabase = createClient()

  try {
    // Create products table
    const { error: tableError } = await supabase.rpc("create_products_table")

    if (tableError) {
      console.error("Error creating table:", tableError)
      // If RPC doesn't work, we'll handle this in the component
    }

    // Insert sample products
    const sampleProducts = [
      {
        product_name: "Premium Wireless Headphones",
        description:
          "Experience crystal-clear audio with our premium wireless headphones featuring noise cancellation and 30-hour battery life.",
        price: 199.99,
        affiliate_link: "https://example.com/headphones?ref=affiliate123",
        image_url: "/premium-wireless-headphones.png",
      },
      {
        product_name: "Smart Fitness Tracker",
        description:
          "Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
        price: 149.99,
        affiliate_link: "https://example.com/fitness-tracker?ref=affiliate123",
        image_url: "static/images/fitness-tracker.png",
      },
      {
        product_name: "Ergonomic Office Chair",
        description:
          "Improve your productivity with this ergonomic office chair designed for all-day comfort and proper posture.",
        price: 299.99,
        affiliate_link: "https://example.com/office-chair?ref=affiliate123",
        image_url: "/ergonomic-office-chair.png",
      },
    ]

    const { error: insertError } = await supabase.from("products").insert(sampleProducts)

    if (insertError) {
      console.error("Error inserting products:", insertError)
    }

    redirect("/")
  } catch (error) {
    console.error("Setup error:", error)
  }
}

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-800">Database Setup</CardTitle>
          <CardDescription>Initialize the products table and sample data</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={setupDatabase} className="space-y-4">
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Setup Database
            </Button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            This will create the products table and add sample products to get you started.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
