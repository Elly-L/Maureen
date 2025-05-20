"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Trash, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    unit: "kg",
    category: "Vegetables",
    image_url: "",
    location: "",
  })

  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      return
    }

    fetchProducts()
  }, [user])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)

      if (!user) {
        console.error("No user found")
        return
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      console.log("Fetched products:", data)
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview the image
    const reader = new FileReader()
    reader.onloadend = () => {
      if (isEdit) {
        setEditImagePreview(reader.result as string)
        setEditImageFile(file)
      } else {
        setImagePreview(reader.result as string)
        setImageFile(file)
      }
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const { data } = supabase.storage.from("product-images").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const handleAddProduct = async () => {
    try {
      setIsSubmitting(true)

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add products.",
          variant: "destructive",
        })
        return
      }

      // Validate inputs
      if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.quantity) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      let imageUrl = ""

      // Upload image if provided
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split(".").pop()
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
          const filePath = `${user.id}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, imageFile)

          if (uploadError) {
            throw uploadError
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath)

          imageUrl = publicUrl
        } catch (error) {
          console.error("Error uploading image:", error)
          toast({
            title: "Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          })
          return
        }
      }

      // Add product to database
      const { error: insertError } = await supabase
        .from("products")
        .insert([
          {
            name: newProduct.name,
            description: newProduct.description,
            price: parseFloat(newProduct.price),
            quantity: parseFloat(newProduct.quantity),
            unit: newProduct.unit,
            category: newProduct.category,
            image_url: imageUrl,
            seller_id: user.id,
            location: newProduct.location || user.location || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
        ])

      if (insertError) {
        console.error("Database error:", insertError)
        throw insertError
      }

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
        unit: "kg",
        category: "Vegetables",
        image_url: "",
        location: "",
      })
      setImageFile(null)
      setImagePreview(null)
      setIsAddDialogOpen(false)

      // Refresh products
      await fetchProducts()

      toast({
        title: "Success",
        description: "Product added successfully!",
      })
    } catch (error: any) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async () => {
    try {
      setIsSubmitting(true)

      if (!currentProduct) return

      // Validate inputs
      if (!currentProduct.name || !currentProduct.description || !currentProduct.price || !currentProduct.quantity) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      let imageUrl = currentProduct.image_url

      // Upload new image if provided
      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile)
      }

      // Update product in database
      const { error } = await supabase
        .from("products")
        .update({
          name: currentProduct.name,
          description: currentProduct.description,
          price: Number.parseFloat(currentProduct.price),
          quantity: Number.parseFloat(currentProduct.quantity),
          unit: currentProduct.unit,
          category: currentProduct.category,
          image_url: imageUrl,
          location: currentProduct.location || user?.location || "",
        })
        .eq("id", currentProduct.id)

      if (error) {
        throw error
      }

      // Reset form
      setCurrentProduct(null)
      setEditImageFile(null)
      setEditImagePreview(null)
      setIsEditDialogOpen(false)

      // Refresh products
      await fetchProducts()

      toast({
        title: "Product updated",
        description: "Your product has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) {
        throw error
      }

      // Refresh products
      await fetchProducts()

      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (product: any) => {
    setCurrentProduct({
      ...product,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
    })
    setEditImagePreview(product.image_url)
    setIsEditDialogOpen(true)
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <p className="text-lg text-muted-foreground">Please log in to view your products.</p>
          <Button className="mt-4" onClick={() => router.push("/auth/login")}>
            Log In
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new product to your inventory.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name*</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Fresh Potatoes"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe your product"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (KSh)*</Label>
                  <Input
                    id="price"
                    type="text"
                    inputMode="decimal"
                    value={newProduct.price}
                    onChange={(e) => {
                      const value = e.target.value
                      // Allow empty string, digits, and at most one decimal point
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setNewProduct({ ...newProduct, price: value })
                      }
                    }}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity*</Label>
                  <Input
                    id="quantity"
                    type="text"
                    inputMode="decimal"
                    value={newProduct.quantity}
                    onChange={(e) => {
                      const value = e.target.value
                      // Allow empty string, digits, and at most one decimal point
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setNewProduct({ ...newProduct, quantity: value })
                      }
                    }}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit*</Label>
                  <Select
                    value={newProduct.unit}
                    onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="g">Gram (g)</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                      <SelectItem value="crate">Crate</SelectItem>
                      <SelectItem value="bag">Bag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Grains">Grains & Cereals</SelectItem>
                      <SelectItem value="Dairy">Dairy Products</SelectItem>
                      <SelectItem value="Meat">Meat & Poultry</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                  placeholder={user?.location || "e.g. Nairobi"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                    {imagePreview ? (
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e)}
                      className="cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Upload a product image (max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Plus className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No products yet</h2>
          <p className="mt-2 text-muted-foreground">Add your first product to start selling on FarmConnect.</p>
          <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            Add Product
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {product.image_url ? (
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <p className="text-muted-foreground">No image</p>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      KSh {product.price}/{product.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.quantity} {product.unit}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Make changes to your product.</DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name*</Label>
                <Input
                  id="edit-name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description*</Label>
                <Textarea
                  id="edit-description"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price (KSh)*</Label>
                  <Input
                    id="edit-price"
                    type="text"
                    inputMode="decimal"
                    value={currentProduct.price}
                    onChange={(e) => {
                      const value = e.target.value
                      // Allow empty string, digits, and at most one decimal point
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setCurrentProduct({ ...currentProduct, price: value })
                      }
                    }}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-quantity">Quantity*</Label>
                  <Input
                    id="edit-quantity"
                    type="text"
                    inputMode="decimal"
                    value={currentProduct.quantity}
                    onChange={(e) => {
                      const value = e.target.value
                      // Allow empty string, digits, and at most one decimal point
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setCurrentProduct({ ...currentProduct, quantity: value })
                      }
                    }}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-unit">Unit*</Label>
                  <Select
                    value={currentProduct.unit}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="g">Gram (g)</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                      <SelectItem value="crate">Crate</SelectItem>
                      <SelectItem value="bag">Bag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category*</Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Grains">Grains & Cereals</SelectItem>
                      <SelectItem value="Dairy">Dairy Products</SelectItem>
                      <SelectItem value="Meat">Meat & Poultry</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={currentProduct.location}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, location: e.target.value })}
                  placeholder={user?.location || "e.g. Nairobi"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                    {editImagePreview ? (
                      <Image
                        src={editImagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                      className="cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Upload a new product image (max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
