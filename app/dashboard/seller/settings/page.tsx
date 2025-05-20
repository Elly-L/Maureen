"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

const locations = [
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
  "Kikuyu",
  "Juja",
]

export default function SellerSettingsPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessDescription: "",
    paymentMethods: "",
    deliveryOptions: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: "",
      })

      // Fetch additional business data if available
      const fetchBusinessData = async () => {
        const { data, error } = await supabase.from("seller_profiles").select("*").eq("user_id", user.id).single()

        if (data && !error) {
          setBusinessData({
            businessName: data.business_name || "",
            businessDescription: data.business_description || "",
            paymentMethods: data.payment_methods || "",
            deliveryOptions: data.delivery_options || "",
          })
        }
      }

      fetchBusinessData()
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profileData.name,
          phone: profileData.phone,
          location: profileData.location,
        })
        .eq("id", user?.id)

      if (error) throw error

      // Update email if changed
      if (user?.email !== profileData.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email,
        })

        if (emailError) throw emailError

        toast({
          title: "Email update initiated",
          description: "Please check your new email for a confirmation link.",
        })
      }

      // Update or insert seller profile data
      const { error: businessError } = await supabase.from("seller_profiles").upsert({
        user_id: user?.id,
        business_name: businessData.businessName,
        business_description: businessData.businessDescription,
        payment_methods: businessData.paymentMethods,
        delivery_options: businessData.deliveryOptions,
      })

      if (businessError) throw businessError

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.")

    if (confirm) {
      setLoading(true)
      try {
        // Delete user account
        const { error } = await supabase.rpc("delete_user")

        if (error) throw error

        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully.",
        })

        // Log out the user
        logout()
      } catch (error: any) {
        toast({
          title: "Delete failed",
          description: error.message || "There was an error deleting your account.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Seller Settings</h1>
          <p className="text-muted-foreground">Manage your seller account settings and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Changing your email will require verification of the new address.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={profileData.location}
                      onValueChange={(value) => setProfileData({ ...profileData, location: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your location" />
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
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell buyers about yourself"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="business" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Update your business details to help buyers find and trust you.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessData.businessName}
                      onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      value={businessData.businessDescription}
                      onChange={(e) => setBusinessData({ ...businessData, businessDescription: e.target.value })}
                      placeholder="Describe your business, products, and farming practices"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethods">Payment Methods</Label>
                    <Textarea
                      id="paymentMethods"
                      value={businessData.paymentMethods}
                      onChange={(e) => setBusinessData({ ...businessData, paymentMethods: e.target.value })}
                      placeholder="List payment methods you accept (e.g., M-Pesa, Cash, Bank Transfer)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryOptions">Delivery Options</Label>
                    <Textarea
                      id="deliveryOptions"
                      value={businessData.deliveryOptions}
                      onChange={(e) => setBusinessData({ ...businessData, deliveryOptions: e.target.value })}
                      placeholder="Describe your delivery options and areas covered"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Actions in this section can lead to permanent data loss. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting your account will remove all your personal information, products, orders, and other data from our
              system. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
