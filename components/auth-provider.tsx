"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
  signup: (user: Partial<User>, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("farmconnect-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // This is a mock implementation - in a real app, you'd call your API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - in a real app, this would come from your backend
      const mockUsers = [
        {
          id: "1",
          name: "John Seller",
          email: "seller@example.com",
          password: "password",
          role: "seller",
          location: "Nairobi",
          phone: "0712345678",
        },
        { id: "2", name: "Jane Buyer", email: "buyer@example.com", password: "password", role: "buyer" },
      ]

      const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid credentials")
      }

      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword as User)
      localStorage.setItem("farmconnect-user", JSON.stringify(userWithoutPassword))

      // Redirect based on role
      if (userWithoutPassword.role === "seller") {
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
      // This is a mock implementation - in a real app, you'd call your API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a new user with a random ID
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "buyer",
        location: userData.location,
        phone: userData.phone,
      } as User

      setUser(newUser)
      localStorage.setItem("farmconnect-user", JSON.stringify(newUser))

      // Redirect based on role
      if (newUser.role === "seller") {
        router.push("/dashboard/seller")
      } else {
        router.push("/shop")
      }
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("farmconnect-user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
