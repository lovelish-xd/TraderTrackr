"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([])

  // Fetch countries from API on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name")
        const data = await res.json()
        const countryList = data
          .map((c: any) => ({
            name: c.name.common
          }))
          .filter(Boolean)
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
        setCountries(countryList)
      } catch (error) {
        setCountries([
          { name: "India", code: "IN" },
          { name: "United States", code: "US" },
          { name: "United Kingdom", code: "GB" },
          { name: "Canada", code: "CA" },
          { name: "Australia", code: "AU" },
        ])
      }
    }
    fetchCountries()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  if (formData.password !== formData.confirmPassword) {
    toast({
      title: "Error",
      description: "Passwords do not match.",
      variant: "destructive",
    })
    setIsLoading(false)
    return
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          country: formData.country,
        },
        emailRedirectTo: `${window.location.origin}/login?confirmed=true`,
      },
    })

    if (error) throw error

    toast({
      title: "Account created!",
      description: "Please check your email to verify your account.",
    })

    router.push("/login")
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Something went wrong. Please try again.",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}


  const handleGoogleSignup = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen w-full">
        {/* Left Section - Image / Branding */}
        <div className="flex w-1/2 items-center justify-center">
          {/* Desktop Logo */}
           <Link
            href="/"
            className="absolute left-8 top-8 flex items-center z-50 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#185E61"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10"
            >
              <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
            </svg>
            <span className="font-bold text-lg text-[#185E61]">TraderTrackr</span>
          </Link>
          <div className="flex flex-col items-center space-y-4">
            <img src="/signup-page.png" alt="Logo" className="h-[350px]" />
            <p className="text-muted-foreground text-center max-w-md">
              Join TraderTrackr today and take control of your trading journey with powerful analytics and smart journaling tools.
            </p>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="w-1/2 flex items-center justify-center  relative">
          <div className="w-full p-8">
            <Card className="w-full p-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Fill in the details below to create your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="m@example.com"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading} 
                    style={{ backgroundColor: "#185E61", color: "#fff" }}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  style={{ color: "#185E61" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      fill="#185E61"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#185E61"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#185E61"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#185E61"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
              </CardContent>
              <CardFooter>
                <p className="text-center text-sm text-muted-foreground w-full">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Login
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col">
        {/* Mobile Header with Logo */}
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#185E61"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
            </svg>
            <span className="font-bold text-lg text-[#185E61] ml-2">TraderTrackr</span>
          </Link>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <Card className="w-full">
              <CardHeader className="text-center">
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Fill in the details below to create your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName-mobile">First Name</Label>
                    <Input
                      id="firstName-mobile"
                      name="firstName"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName-mobile">Last Name</Label>
                    <Input
                      id="lastName-mobile"
                      name="lastName"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country-mobile">Country</Label>
                    <select
                      id="country-mobile"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-mobile">Email</Label>
                    <Input
                      id="email-mobile"
                      name="email"
                      placeholder="m@example.com"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-mobile">Password</Label>
                    <Input
                      id="password-mobile"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword-mobile">Confirm Password</Label>
                    <Input
                      id="confirmPassword-mobile"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading} 
                    style={{ backgroundColor: "#185E61", color: "#fff" }}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  style={{ color: "#185E61" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      fill="#185E61"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#185E61"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#185E61"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#185E61"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
              </CardContent>
              <CardFooter>
                <p className="text-center text-sm text-muted-foreground w-full">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Login
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}