import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { use } from "react"

async function getData() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: categories } = await supabase.from("categories").select("id, name, slug").order("name")
  return { categories: categories || [] }
}

export default function CategoriesAdminPage() {
  const { categories } = use(getData())
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Manage Categories</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={async (formData: FormData) => {
                "use server"
                const supabase = createClient()
                const name = (formData.get("name") as string)?.trim()
                if (!name) return
                const slug = name
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-")
                  .replace(/-+/g, "-")
                await supabase.from("categories").insert({ name, slug }).select("id").single()
              }}
              className="flex gap-2"
            >
              <Input name="name" placeholder="e.g. HEALTH AND FITNESS" />
              <Button type="submit">Add</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {categories.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">/{c.slug}</div>
                </div>
                {/* Optional: add delete later; keep non-destructive now */}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

