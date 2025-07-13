"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country: "",
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countries, setCountries] = useState<{ name: string }[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name")
        const data = await res.json()
        const sorted = data
          .map((c: any) => ({ name: c.name.common }))
          .filter(Boolean)
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
        setCountries(sorted)
      } catch (err) {
        setCountries([{ name: "India" }, { name: "United States" }])
      }
    }

    const checkProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile && profile.country) {
        // profile already exists, redirect
        router.push("/dashboard")
      } else {
        setLoading(false)
      }
    }

    fetchCountries()
    checkProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCountryChange = (value: string) => {
    setFormData({ ...formData, country: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        email: user?.email,
        ...formData,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Profile completed!",
        description: "Welcome to TraderTrackr!",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-[#185E61]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#185E61" strokeWidth="4"></circle>
            <path className="opacity-75" fill="#185E61" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="mt-4 text-[#185E61] font-semibold">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-[#185E61]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#185E61" strokeWidth="4"></circle>
              <path className="opacity-75" fill="#185E61" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="mt-4 text-[#185E61] font-semibold">Saving your profile...</span>
          </div>
        </div>
      )}
      <div className="flex h-screen w-screen">
        {/* Left Section - Image / Branding */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <img src="/complete-profile.png" alt="Complete Profile" className="h-[350px]" />
            <p className="text-muted-foreground text-center max-w-md">
              Complete your profile to get started with TraderTrackr and unlock all features.
            </p>
          </div>
        </div>

        {/* Right Section - Profile Form */}
        <div className="flex w-full md:w-1/2 items-center justify-center px-4">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px] md:w-[600px] lg:w-[700px]">
            <Link href="#" className="absolute left-4 top-4 flex items-center space-x-2 md:left-8 md:top-8">
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

            <Card className="min-w-[100%] p-6 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>Tell us a bit about yourself to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Enter your first name"
                      required
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Enter your last name"
                      required
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={handleCountryChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.name} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    style={{ backgroundColor: "#185E61", color: "#fff" }}
                  >
                    {isSubmitting ? "Saving..." : "Save & Continue"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
