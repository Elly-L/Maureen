"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user, login, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user && !authLoading) {
      console.log("User already logged in, redirecting")
      if (user.role === "seller") {
        router.push("/dashboard/seller")
      } else {
        router.push("/shop")
      }
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      setSuccess(true)
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })

      // Redirect after a short delay to show success message
      setTimeout(() => {
        const redirectPath = email.includes("seller") ? "/dashboard/seller" : "/shop"
        router.push(redirectPath)
      }, 1500)
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If still loading auth state, show nothing
  if (authLoading) {
    return null
  }

  // If user is already logged in, this will redirect (see useEffect)
  if (user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Alert className="max-w-md">
          <AlertTitle>Already logged in</AlertTitle>
          <AlertDescription>
            <p className="mb-4">You are already logged in as {user.name}.</p>
            <Button asChild>
              <Link href={user.role === "seller" ? "/dashboard/seller" : "/shop"}>Go to Dashboard</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="flex items-center justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">FarmConnect</span>
            </Link>
          </div>

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertTitle>Login successful!</AlertTitle>
              <AlertDescription>
                You have been logged in successfully. Redirecting you to your dashboard...
              </AlertDescription>
            </Alert>
          )}

          <div className="w-full space-y-8 rounded-lg border bg-card p-6 shadow-sm">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-gray-500">Enter your credentials to access your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || success}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
