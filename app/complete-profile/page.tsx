"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country: "",
  })
  const [loading, setLoading] = useState(true)
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

      if (profile) {
        // profile already exists, redirect
        router.push("/dashboard")
      } else {
        setLoading(false)
      }
    }

    fetchCountries()
    checkProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from("profiles").upsert({
      id: user?.id,
      email: user?.email,
      ...formData,
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    toast({
      title: "Profile saved!",
      description: "Redirecting to your dashboard...",
    })

    router.push("/dashboard")
  }

  if (loading) return <p className="text-center mt-20">Loading...</p>

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                name="first_name"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                name="last_name"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <select
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Save & Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
