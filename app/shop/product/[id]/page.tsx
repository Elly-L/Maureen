"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Leaf, Mail, MapPin, Phone, ShoppingCart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

// Mock data for products
const allProducts = [
  {
    id: "1",
    name: "Fresh Potatoes",
    description:
      "Locally grown potatoes, perfect for cooking. These potatoes are harvested from fertile soils in the highlands of Kenya. They are perfect for making chips, mashing, or boiling. Buy directly from the farmer and enjoy fresh, high-quality produce.",
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
    description:
      "Fresh red onions from Naivasha farms. These onions are grown using organic farming methods and are harvested at the perfect time to ensure maximum flavor. They are great for adding flavor to your dishes or for making salads.",
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
    description:
      "Juicy tomatoes, perfect for salads and cooking. These tomatoes are grown in greenhouses to protect them from pests and diseases. They are harvested when fully ripe to ensure the best flavor and nutritional value.",
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
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<any[]>([])
  const [activeImage, setActiveImage] = useState(0)

  const { user } = useAuth()
  const { toast } = useToast()

  // Find the product with the matching ID
  const product = allProducts.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/shop" className="mt-4 text-primary hover:underline">
          Back to Shop
        </Link>
      </div>
    )
  }

  // Mock additional product images
  const productImages = [
    product.image,
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pDRSWIvcc2BYCSGY5QTsiYo5PiHQFO.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QCE7H5bngULNfUn4OwIXSo9SRBVTRb.png",
  ]

  const addToCart = () => {
    // In a real app, you would update the cart in a global state or context
    setCart([...cart, { ...product, cartQuantity: quantity }])

    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity > 1 ? "units" : "unit"} of ${product.name} added to your cart.`,
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
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <Link href="/shop" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
                <Image
                  src={productImages[activeImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square cursor-pointer overflow-hidden rounded-md border ${
                      activeImage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">{product.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  KSh {product.price}/{product.unit}
                </div>
                <div className="text-sm text-muted-foreground">
                  Available: {product.quantity} {product.unit}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="mx-4 min-w-[40px] text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </Button>
                  <span className="ml-4 text-sm text-muted-foreground">
                    Total: KSh {(product.price * quantity).toLocaleString()}
                  </span>
                </div>

                <Button className="w-full" onClick={addToCart}>
                  Add to Cart
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Name:</span>
                      <span>{product.seller.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{product.seller.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{product.seller.email}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Contact the seller directly to arrange payment and delivery.
                  </div>
                </CardContent>
              </Card>
            </div>
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
