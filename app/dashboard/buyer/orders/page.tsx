"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Phone } from "lucide-react"

// Mock data for orders
const orders = [
  {
    id: "FC-1234",
    date: "2023-05-15",
    seller: {
      name: "John Farmer",
      email: "john@example.com",
      phone: "0712345678",
    },
    items: [
      { name: "Potatoes", quantity: 5, unit: "kg", price: 120 },
      { name: "Tomatoes", quantity: 2, unit: "kg", price: 150 },
    ],
    total: 1250,
    status: "pending",
  },
  {
    id: "FC-1233",
    date: "2023-05-14",
    seller: {
      name: "Mary Grower",
      email: "mary@example.com",
      phone: "0723456789",
    },
    items: [
      { name: "Onions", quantity: 10, unit: "kg", price: 100 },
      { name: "Cabbage", quantity: 5, unit: "kg", price: 220 },
    ],
    total: 2100,
    status: "completed",
  },
  {
    id: "FC-1232",
    date: "2023-05-13",
    seller: {
      name: "Peter Grower",
      email: "peter@example.com",
      phone: "0734567890",
    },
    items: [
      { name: "Carrots", quantity: 3, unit: "kg", price: 150 },
      { name: "Spinach", quantity: 2, unit: "kg", price: 250 },
    ],
    total: 950,
    status: "pending",
  },
]

export default function BuyerOrdersPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Order {order.id}</CardTitle>
                    <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge
                    className={
                      order.status === "completed"
                        ? "bg-green-500"
                        : order.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Items</h3>
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-sm">
                          {item.quantity} {item.unit} {item.name} - KSh {item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                    <p className="font-bold mt-2">Total: KSh {order.total}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Seller</h3>
                    <p className="text-sm">{order.seller.name}</p>
                    <p className="text-sm">{order.seller.email}</p>
                    <div className="flex items-center mt-2">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="mr-2 h-4 w-4" /> Call Seller
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4 mt-6">
          {orders
            .filter((order) => order.status === "pending")
            .map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Order {order.id}</CardTitle>
                      <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge className="bg-yellow-500">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-2">Items</h3>
                      <ul className="space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item.quantity} {item.unit} {item.name} - KSh {item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                      <p className="font-bold mt-2">Total: KSh {order.total}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Seller</h3>
                      <p className="text-sm">{order.seller.name}</p>
                      <p className="text-sm">{order.seller.email}</p>
                      <div className="flex items-center mt-2">
                        <Button variant="outline" size="sm" className="mr-2">
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" /> Call Seller
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4 mt-6">
          {orders
            .filter((order) => order.status === "completed")
            .map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Order {order.id}</CardTitle>
                      <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge className="bg-green-500">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-2">Items</h3>
                      <ul className="space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item.quantity} {item.unit} {item.name} - KSh {item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                      <p className="font-bold mt-2">Total: KSh {order.total}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Seller</h3>
                      <p className="text-sm">{order.seller.name}</p>
                      <p className="text-sm">{order.seller.email}</p>
                      <div className="flex items-center mt-2">
                        <Button variant="outline" size="sm" className="mr-2">
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" /> Call Seller
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
