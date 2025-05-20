"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, Trash } from "lucide-react"

// Mock data for cart items
const initialCartItems = [
  {
    id: "1",
    name: "Fresh Potatoes",
    price: 120,
    unit: "kg",
    cartQuantity: 2,
    seller: {
      id: "s1",
      name: "John Farmer",
      phone: "0712345678",
      email: "john@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lHhjsozGLWgNt4yFrDeBRbgehpNeXM.png",
  },
  {
    id: "3",
    name: "Ripe Tomatoes",
    price: 150,
    unit: "kg",
    cartQuantity: 1,
    seller: {
      id: "s3",
      name: "Peter Grower",
      phone: "0734567890",
      email: "peter@example.com",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pDRSWIvcc2BYCSGY5QTsiYo5PiHQFO.png",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [selectedSeller, setSelectedSeller] = useState<any>(null)
  const { toast } = useToast()

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    })
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, cartQuantity: newQuantity } : item))

    setCartItems(updatedCart)
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0)
  }

  const groupBySeller = () => {
    const grouped: Record<string, any[]> = {}

    cartItems.forEach((item) => {
      const sellerId = item.seller.id
      if (!grouped[sellerId]) {
        grouped[sellerId] = []
      }
      grouped[sellerId].push(item)
    })

    return grouped
  }

  const contactSeller = (seller: any) => {
    setSelectedSeller(seller)
  }

  const placeOrder = () => {
    toast({
      title: "Order placed",
      description: "Your order has been placed successfully. Contact the seller to arrange payment and delivery.",
    })

    // In a real app, you would create an order in the database
    setCartItems([])
  }

  const groupedItems = groupBySeller()

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">Your cart is empty.</p>
          <Link href="/shop">
            <Button className="mt-4">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 mt-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([sellerId, items]) => (
              <Card key={sellerId}>
                <CardHeader>
                  <CardTitle>Seller: {items[0].seller.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            KSh {item.price}/{item.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.cartQuantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">KSh {item.price * item.cartQuantity}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button onClick={() => contactSeller(items[0].seller)}>Contact Seller</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>KSh {calculateTotal()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>KSh {calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={placeOrder}>
                  Place Order
                </Button>
              </CardFooter>
            </Card>
            <div className="text-sm text-muted-foreground">
              <p>
                Note: FarmConnect does not handle payments. After placing your order, you will need to contact the
                seller directly to arrange payment and delivery.
              </p>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!selectedSeller} onOpenChange={(open) => !open && setSelectedSeller(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>Contact the seller directly to arrange payment and delivery.</DialogDescription>
          </DialogHeader>
          {selectedSeller && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Seller Information</h3>
                <div className="space-y-1">
                  <p>Name: {selectedSeller.name}</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <p>{selectedSeller.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <p>{selectedSeller.email}</p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  You can call or email the seller to discuss payment methods, delivery options, and any other details
                  about your order.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedSeller(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
