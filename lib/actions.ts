"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    redirect("/")
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    redirect("/")
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function uploadImage(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const file = formData.get("file") as File
  if (!file) {
    return { error: "No file provided" }
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" }
  }

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size must be less than 5MB" }
  }

  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("product-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      return { error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(fileName)

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Failed to upload image" }
  }
}

export async function createProduct(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const productName = formData.get("product_name")
  const description = formData.get("description")
  const price = formData.get("price")
  const discount = formData.get("discount")
  const badge = formData.get("badge")
  const affiliateLink = formData.get("affiliate_link")
  const imageUrl = formData.get("image_url")

  if (!productName || !price) {
    return { error: "Product name and price are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.from("products").insert({
      product_name: productName.toString(),
      description: description?.toString() || "",
      price: Number.parseFloat(price.toString()),
      discount: discount ? Number.parseFloat(discount.toString()) : 0,
      badge: badge?.toString() || null,
      affiliate_link: affiliateLink?.toString() || "",
      image_url: imageUrl?.toString() || "",
      click_count: 0,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: "Product created successfully!" }
  } catch (error) {
    console.error("Create product error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updateProduct(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const id = formData.get("id")
  const productName = formData.get("product_name")
  const description = formData.get("description")
  const price = formData.get("price")
  const discount = formData.get("discount")
  const badge = formData.get("badge")
  const affiliateLink = formData.get("affiliate_link")
  const imageUrl = formData.get("image_url")

  if (!id || !productName || !price) {
    return { error: "ID, product name and price are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase
      .from("products")
      .update({
        product_name: productName.toString(),
        description: description?.toString() || "",
        price: Number.parseFloat(price.toString()),
        discount: discount ? Number.parseFloat(discount.toString()) : 0,
        badge: badge?.toString() || null,
        affiliate_link: affiliateLink?.toString() || "",
        image_url: imageUrl?.toString() || "",
      })
      .eq("id", id.toString())

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: "Product updated successfully!" }
  } catch (error) {
    console.error("Update product error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function deleteProduct(id: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/")
    revalidatePath("/admin")
  } catch (error) {
    console.error("Delete product error:", error)
    throw error
  }
}

export async function setupDatabase() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    // Create products table using raw SQL
    const { error: tableError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_name TEXT NOT NULL,
          description TEXT,
          price NUMERIC,
          affiliate_link TEXT,
          image_url TEXT,
          click_count INTEGER DEFAULT 0,
          badge TEXT,
          discount NUMERIC,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        
        -- Allow public read access
        CREATE POLICY IF NOT EXISTS "Allow public read access" ON products
          FOR SELECT USING (true);
        
        -- Allow authenticated users to insert/update/delete
        CREATE POLICY IF NOT EXISTS "Allow authenticated users full access" ON products
          FOR ALL USING (auth.role() = 'authenticated');
        
        -- Create click_tracking table
        CREATE TABLE IF NOT EXISTS click_tracking (
          id SERIAL PRIMARY KEY,
          product_id UUID REFERENCES products(id),
          clicked_at TIMESTAMP DEFAULT NOW()
        );
      `,
    })

    if (tableError) {
      console.error("Error creating table:", tableError)
      // Try alternative approach - direct table creation
      const { error: directError } = await supabase.from("products").select("id").limit(1)

      if (directError && directError.code === "PGRST116") {
        // Table doesn't exist, we need to create it manually
        throw new Error("Products table needs to be created manually in Supabase dashboard")
      }
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
        click_count: 0,
        badge: null,
        discount: 0,
      },
      {
        product_name: "Smart Fitness Tracker",
        description:
          "Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
        price: 149.99,
        affiliate_link: "https://example.com/fitness-tracker?ref=affiliate123",
        image_url: "/static/images/fitness-tracker.png",
        click_count: 0,
        badge: null,
        discount: 0,
      },
      {
        product_name: "Ergonomic Office Chair",
        description:
          "Improve your productivity with this ergonomic office chair designed for all-day comfort and proper posture.",
        price: 299.99,
        affiliate_link: "https://example.com/office-chair?ref=affiliate123",
        image_url: "/ergonomic-office-chair.png",
        click_count: 0,
        badge: null,
        discount: 0,
      },
    ]

    // Check if products already exist
    const { data: existingProducts } = await supabase.from("products").select("id").limit(1)

    if (!existingProducts || existingProducts.length === 0) {
      const { error: insertError } = await supabase.from("products").insert(sampleProducts)

      if (insertError) {
        console.error("Error inserting products:", insertError)
        return { error: insertError.message }
      }
    }

    revalidatePath("/")
    return { success: "Database setup completed successfully!" }
  } catch (error) {
    console.error("Setup error:", error)
    return { error: error instanceof Error ? error.message : "Setup failed" }
  }
}

export async function trackProductClick(productId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    // Insert click tracking record
    const { error: clickError } = await supabase.from("click_tracking").insert({
      product_id: productId,
      clicked_at: new Date().toISOString(),
    })

    if (clickError) {
      console.error("Click tracking error:", clickError)
    }

    // Update product click count
    const { error: updateError } = await supabase.rpc("increment_click_count", {
      product_id: productId,
    })

    if (updateError) {
      console.error("Click count update error:", updateError)
    }

    return { success: true }
  } catch (error) {
    console.error("Track click error:", error)
    return { error: "Failed to track click" }
  }
}

export async function getProductAnalytics() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, product_name, click_count, price, badge, discount")
      .order("click_count", { ascending: false })

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Analytics error:", error)
    return { error: "Failed to fetch analytics" }
  }
}
