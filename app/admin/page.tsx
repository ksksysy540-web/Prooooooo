import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, DollarSign, LogOut, Edit, Eye, MousePointer, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "@/lib/actions"
import DeleteProductButton from "@/components/delete-product-button"

export default async function AdminDashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch products with click tracking data
  const { data: products, count } = await supabase
    .from("products")
    .select(
      `
      *,
      click_tracking(count)
    `,
      { count: "exact" },
    )
    .order("click_count", { ascending: false })

  // Calculate analytics data
  const totalValue = products?.reduce((sum, product) => sum + Number(product.price), 0) || 0
  const totalClicks = products?.reduce((sum, product) => sum + (product.click_count || 0), 0) || 0
  const topProduct = products?.[0]

  // Get recent click activity
  const { data: recentClicks } = await supabase
    .from("click_tracking")
    .select(`
      *,
      products(product_name)
    `)
    .order("clicked_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Product Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
            <Button variant="outline" asChild>
              <Link href="/admin/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Eye className="h-4 w-4 mr-2" />
                View Store
              </Link>
            </Button>
            <form action={signOut}>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Updated analytics cards with click tracking */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count || 0}</div>
              <p className="text-xs text-muted-foreground">Products in catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks}</div>
              <p className="text-xs text-muted-foreground">Product interactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catalog Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total product value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Product</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topProduct?.click_count || 0}</div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {topProduct?.product_name || "No clicks yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Product Management</h2>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={product.product_name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">${product.price}</Badge>
                  {/* Added ranking badge */}
                  {index < 3 && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-50">#{index + 1} Popular</Badge>
                  )}
                  {/* Added product badge if exists */}
                  {product.badge && (
                    <Badge className="absolute bottom-2 left-2 bg-green-600 text-white">{product.badge}</Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{product.product_name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Added click tracking stats */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{product.click_count || 0} clicks</span>
                    </div>
                    {product.discount && product.discount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-muted-foreground">
                      Created: {new Date(product.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted-foreground">Rank: #{index + 1}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/product/${product.id}`} target="_blank">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <DeleteProductButton productId={product.id} productName={product.product_name} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first product to start building your e-commerce catalog.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
