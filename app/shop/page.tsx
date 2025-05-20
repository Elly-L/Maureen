"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Filter, Leaf, Search, ShoppingCart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Mock data for products
const allProducts = [
  {
    id: "1",
    name: "Fresh Potatoes",
    description: "Locally grown potatoes, perfect for cooking.",
    price: 120,
    quantity: 50,
    unit: "kg",
    category: "Vegetables",
    location: "Nairobi",
    seller: {
      id: "s1",
      name: "John Farmer",
      phone: "0712345678",
      email: "john@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lHhjsozGLWgNt4yFrDeBRbgehpNeXM.png",
  },
  {
    id: "2",
    name: "Red Onions",
    description: "Fresh red onions from Naivasha farms.",
    price: 100,
    quantity: 30,
    unit: "kg",
    category: "Vegetables",
    location: "Naivasha",
    seller: {
      id: "s2",
      name: "Mary Grower",
      phone: "0723456789",
      email: "mary@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QCE7H5bngULNfUn4OwIXSo9SRBVTRb.png",
  },
  {
    id: "3",
    name: "Ripe Tomatoes",
    description: "Juicy tomatoes, perfect for salads and cooking.",
    price: 150,
    quantity: 25,
    unit: "kg",
    category: "Vegetables",
    location: "Kiambu",
    seller: {
      id: "s3",
      name: "Peter Grower",
      phone: "0734567890",
      email: "peter@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pDRSWIvcc2BYCSGY5QTsiYo5PiHQFO.png",
  },
  {
    id: "4",
    name: "Fresh Milk",
    description: "Farm fresh milk, pasteurized and ready to drink.",
    price: 70,
    quantity: 100,
    unit: "liter",
    category: "Dairy",
    location: "Nakuru",
    seller: {
      id: "s4",
      name: "Sarah Dairy",
      phone: "0745678901",
      email: "sarah@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-q7MF0FXxfKpGSNrQDdxvmGW3j6NZsG.png",
  },
  {
    id: "5",
    name: "Green Cabbage",
    description: "Fresh green cabbage, perfect for salads and cooking.",
    price: 80,
    quantity: 40,
    unit: "piece",
    category: "Vegetables",
    location: "Limuru",
    seller: {
      id: "s5",
      name: "James Farmer",
      phone: "0756789012",
      email: "james@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eNBlYlNxta2dPVp8IoWzNwbuwz39jn.png",
  },
  {
    id: "6",
    name: "Fresh Spinach",
    description: "Nutritious spinach leaves, freshly harvested.",
    price: 50,
    quantity: 60,
    unit: "bunch",
    category: "Vegetables",
    location: "Ruiru",
    seller: {
      id: "s6",
      name: "Lucy Grower",
      phone: "0767890123",
      email: "lucy@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qCSYf34ceDP30WxEeC4JhCGixbONZl.png",
  },
  {
    id: "7",
    name: "Sukuma Wiki",
    description: "Fresh kale leaves, a staple in Kenyan cuisine.",
    price: 40,
    quantity: 70,
    unit: "bunch",
    category: "Vegetables",
    location: "Thika",
    seller: {
      id: "s7",
      name: "David Farmer",
      phone: "0778901234",
      email: "david@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-c2s01IsVMJO5XX1nfbN3RzamPcnMP8.png",
  },
  {
    id: "8",
    name: "Ripe Bananas",
    description: "Sweet ripe bananas, perfect for eating or cooking.",
    price: 200,
    quantity: 20,
    unit: "bunch",
    category: "Fruits",
    location: "Meru",
    seller: {
      id: "s8",
      name: "Grace Grower",
      phone: "0789012345",
      email: "grace@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aPRbmnHeR6Xufl72RJB1AE9VYaW1iK.png",
  },
  {
    id: "9",
    name: "Maize Flour",
    description: "Finely ground maize flour for making ugali.",
    price: 150,
    quantity: 50,
    unit: "kg",
    category: "Grains",
    location: "Nakuru",
    seller: {
      id: "s9",
      name: "Joseph Miller",
      phone: "0790123456",
      email: "joseph@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qP37VnhhhlXL6CGrtn3dHBPXHraH9h.png",
  },
]

const locations = [
  "All Locations",
  "Nairobi",
  "Kiambu",
  "Nakuru",
  "Nyeri",
  "Muranga",
  "Meru",
  "Ruiru",
  "Naivasha",
  "Limuru",
  "Thika",
]

const categories = ["All Categories", "Vegetables", "Fruits", "Grains", "Dairy"]

export default function ShopPage() {
  const [products, setProducts] = useState(allProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [priceRange, setPriceRange] = useState([0, 300])
  const [cart, setCart] = useState<any[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Filter products based on search, location, category, and price
    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = selectedLocation === "All Locations" || product.location === selectedLocation
      const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesLocation && matchesCategory && matchesPrice
    })

    setProducts(filtered)
  }, [searchTerm, selectedLocation, selectedCategory, priceRange])

  const addToCart = (product: any) => {
    // Check if product is already in cart
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      // Increase quantity if already in cart
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item,
      )
      setCart(updatedCart)
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, cartQuantity: 1 }])
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">FarmConnect</span>
            </Link>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center px-6">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/buyer/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cart.length}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            {user ? (
              <Link href={user.role === "seller" ? "/dashboard/seller" : "/dashboard/buyer/orders"}>
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button>Log in</Button>
              </Link>
            )}
          </div>
        </div>
        <div className="container flex md:hidden h-12 items-center justify-between pb-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container grid md:grid-cols-[240px_1fr] gap-6 py-8">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex md:hidden mb-4">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="px-1 py-6 md:py-0 space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Location</h3>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategory === category}
                          onCheckedChange={() => setSelectedCategory(category)}
                        />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 300]}
                      max={300}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex items-center justify-between">
                      <span>KSh {priceRange[0]}</span>
                      <span>KSh {priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <aside className="hidden md:block space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Location</h3>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategory === category}
                      onCheckedChange={() => setSelectedCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
              <div className="space-y-4">
                <Slider defaultValue={[0, 300]} max={300} step={10} value={priceRange} onValueChange={setPriceRange} />
                <div className="flex items-center justify-between">
                  <span>KSh {priceRange[0]}</span>
                  <span>KSh {priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Products</h2>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-muted-foreground">No products found.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-1.5">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-bold">
                            KSh {product.price}/{product.unit}
                          </p>
                          <p className="text-sm text-muted-foreground">{product.location}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <Link href={`/shop/product/${product.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Button size="sm" onClick={() => addToCart(product)}>
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">FarmConnect</span>
          </div>
          <p className="text-center text-sm text-gray-500 md:text-left">
            &copy; {new Date().getFullYear()} FarmConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
