import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createClient()
  try {
    // Fetch categories ordered by name
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name", { ascending: true })

    if (error) {
      return NextResponse.json({ categories: [], error: error.message }, { status: 200 })
    }

    return NextResponse.json({ categories: data || [] })
  } catch (e) {
    return NextResponse.json({ categories: [], error: "Failed to load categories" }, { status: 200 })
  }
}

