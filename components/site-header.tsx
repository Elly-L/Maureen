"use client"

import Link from "next/link"
import { Leaf, Menu, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"

export function SiteHeader() {
  const { user, logout, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <Leaf className="h-6 w-6 text-green-600" />
                <span>FarmConnect</span>
              </Link>
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-medium transition-colors hover:text-primary">
                Shop
              </Link>
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Leaf className="h-6 w-6 text-green-600" />
          <span>FarmConnect</span>
        </Link>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium transition-colors hover:text-primary">
            Shop
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {!isLoading && (
            <>
              {user ? (
                <>
                  <Link href="/dashboard/buyer/cart">
                    <Button variant="ghost" size="icon" className="mr-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="sr-only">Cart</span>
                    </Button>
                  </Link>
                  <div className="flex items-center gap-4">
                    <Link
                      href={user.role === "seller" ? "/dashboard/seller" : "/dashboard/buyer/orders"}
                      className="text-sm font-medium transition-colors hover:text-primary hidden md:block"
                    >
                      Dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => {
                        console.log("User clicked profile button")
                      }}
                    >
                      <User className="h-5 w-5" />
                      <span className="sr-only">Profile</span>
                    </Button>
                    <span className="hidden text-sm font-medium md:block">{user.name}</span>
                    <Button variant="outline" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">Sign up</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
