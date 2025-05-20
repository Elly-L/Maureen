"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, Leaf, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // If not logged in, redirect to login
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!isMounted || !user) {
    return null
  }

  const isSeller = user.role === "seller"

  const sellerNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/seller",
      icon: LayoutDashboard,
    },
    {
      title: "My Products",
      href: "/dashboard/seller/products",
      icon: Package,
    },
    {
      title: "Orders",
      href: "/dashboard/seller/orders",
      icon: ShoppingCart,
    },
    {
      title: "Settings",
      href: "/dashboard/seller/settings",
      icon: Settings,
    },
  ]

  const buyerNavItems = [
    {
      title: "Shop",
      href: "/shop",
      icon: ShoppingCart,
    },
    {
      title: "My Orders",
      href: "/dashboard/buyer/orders",
      icon: Package,
    },
    {
      title: "Cart",
      href: "/dashboard/buyer/cart",
      icon: ShoppingCart,
    },
    {
      title: "Settings",
      href: "/dashboard/buyer/settings",
      icon: Settings,
    },
  ]

  const navItems = isSeller ? sellerNavItems : buyerNavItems

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <Leaf className="h-6 w-6 text-green-600" />
                <span>FarmConnect</span>
              </Link>
              <div className="my-4 h-px bg-muted" />
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                    pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => logout()}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Leaf className="h-6 w-6 text-green-600" />
          <span>FarmConnect</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">User</span>
          </Button>
          <span className="hidden text-sm font-medium md:block">{user.name}</span>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
            <div className="my-4 h-px bg-muted" />
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
