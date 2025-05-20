"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"

type User = {
  id: string
  name: string
  email: string
  role: "buyer" | "seller"
  location?: string
  phone?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (user: Partial<User>, password: string) => Promise<{ requiresEmailConfirmation: boolean; role: string }>
  logout: () => void
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const isRefreshing = useRef(false)

  const refreshUser = async () => {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing.current) {
      console.log("Already refreshing user, skipping...")
      return
    }

    try {
      isRefreshing.current = true
      console.log("Refreshing user...")

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        console.log("Session found:", session.user.id)
        // Get user profile from Supabase
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          return
        }

        if (profile) {
          console.log("Profile loaded:", profile)
          const userData = {
            id: session.user.id,
            name: profile.name || session.user.email?.split("@")[0] || "",
            email: session.user.email || "",
            role: profile.role || "buyer",
            location: profile.location,
            phone: profile.phone,
          }
          console.log("Setting user state:", userData)
          setUser(userData)
        } else {
          console.log("No profile found for user:", session.user.id)
        }
      } else {
        console.log("No session found")
        setUser(null)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
    } finally {
      isRefreshing.current = false
    }
  }

  useEffect(() => {
    // Check if user is logged in with Supabase
    const checkUser = async () => {
      await refreshUser()
      setIsLoading(false)
    }

    checkUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session)

      if (event === "SIGNED_IN" && session) {
        await refreshUser()
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out")
        setUser(null)
      } else if (event === "USER_UPDATED") {
        await refreshUser()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Effect to handle redirects based on auth state
  useEffect(() => {
    if (isLoading) return

    const authRoutes = ["/auth/login", "/auth/signup"]
    const isAuthRoute = authRoutes.includes(pathname)
    const isDashboardRoute = pathname.includes("/dashboard")

    if (user) {
      console.log("User is logged in, current path:", pathname)
      // If user is logged in and on an auth route, redirect to appropriate dashboard
      if (isAuthRoute) {
        console.log("Redirecting from auth route to dashboard")
        if (user.role === "seller") {
          router.push("/dashboard/seller")
        } else {
          router.push("/shop")
        }
      }
    } else {
      console.log("User is not logged in, current path:", pathname)
      // If user is not logged in and trying to access dashboard, redirect to login
      if (isDashboardRoute) {
        console.log("Redirecting from dashboard to login")
        router.push("/auth/login")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      console.log("Login successful:", data)

      // Wait for the session to be established
      await new Promise((resolve) => setTimeout(resolve, 500))

      await refreshUser()

      // Redirect based on role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

      if (profile?.role === "seller") {
        router.push("/dashboard/seller")
      } else {
        router.push("/shop")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: Partial<User>, password: string) => {
    setIsLoading(true)
    try {
      console.log("Signup data:", userData)

      // Ensure role is explicitly set
      const role = userData.role || "buyer"

      // Create auth user with email confirmation disabled for now
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email || "",
        password: password,
        options: {
          data: {
            name: userData.name,
            role: role,
          },
        },
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error("Failed to create user")
      }

      console.log("Signup response:", authData)

      // Create profile regardless of email confirmation status
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          name: userData.name,
          role: role,
          location: userData.location,
          phone: userData.phone,
        },
      ])

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }

      // Wait for the session to be established
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Refresh user state
      await refreshUser()

      // Check if email confirmation is required
      const requiresEmailConfirmation = authData.user.identities && authData.user.identities.length === 0

      if (!requiresEmailConfirmation) {
        // Redirect based on role
        if (role === "seller") {
          router.push("/dashboard/seller")
        } else {
          router.push("/shop")
        }
      }

      return { requiresEmailConfirmation: requiresEmailConfirmation || false, role: role }
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Logout error:", error)
    }
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
