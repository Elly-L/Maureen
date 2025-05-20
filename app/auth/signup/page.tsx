"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export default function SignupPage() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "buyer"
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"buyer" | "seller">(defaultRole as "buyer" | "seller")
  const [location, setLocation] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [signupComplete, setSignupComplete] = useState(false)
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false)
  const [userRole, setUserRole] = useState<string>("buyer")

  const { user, signup, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user && !authLoading) {
      console.log("User already logged in, redirecting from signup")
      if (user.role === "seller") {
        router.push("/dashboard/seller")
      } else {
        router.push("/shop")
      }
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Submitting with role:", role)
      const result = await signup({ name, email, role, location, phone }, password)
      setSignupComplete(true)
      setRequiresEmailConfirmation(result.requiresEmailConfirmation)
      setUserRole(result.role)

      console.log("Signup result:", result)

      toast({
        title: "Account created",
        description: result.requiresEmailConfirmation
          ? "Please check your email for a confirmation link."
          : "Your account has been created successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    if (requiresEmailConfirmation) {
      router.push("/auth/login")
    } else {
      router.push(userRole === "seller" ? "/dashboard/seller" : "/shop")
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

          {signupComplete ? (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertTitle>Account created successfully!</AlertTitle>
              <AlertDescription className="space-y-4">
                {requiresEmailConfirmation ? (
                  <>
                    <p>Please check your email ({email}) for a confirmation link to verify your account.</p>
                    <p>Once verified, you can log in and start using FarmConnect.</p>
                  </>
                ) : (
                  <p>Your account has been created and you are now logged in as a {userRole}.</p>
                )}
                <Button onClick={handleContinue} className="mt-4">
                  {requiresEmailConfirmation
                    ? "Go to Login"
                    : userRole === "seller"
                      ? "Go to Seller Dashboard"
                      : "Go to Shop"}
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="w-full space-y-8 rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Create an Account</h1>
                <p className="text-gray-500">Enter your information to create an account</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
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
                    <Label htmlFor="role">I want to</Label>
                    <RadioGroup
                      value={role}
                      onValueChange={(value) => {
                        console.log("Role changed to:", value)
                        setRole(value as "buyer" | "seller")
                      }}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer">Buy products</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seller" id="seller" />
                        <Label htmlFor="seller">Sell products</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {role === "seller" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Select value={location} onValueChange={setLocation} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="07XXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required={role === "seller"}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
