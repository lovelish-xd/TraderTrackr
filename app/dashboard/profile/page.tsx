"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (!userData.user) {
          throw new Error("User not authenticated")
        }

        setUser(userData.user)

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        setProfile({
          name: profileData?.name || userData.user.user_metadata?.name || "",
          email: userData.user.email || "",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    getProfile()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Update profile in the profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        name: profile.name,
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        throw profileError
      }

      // Update user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          name: profile.name,
        },
      })

      if (userError) {
        throw userError
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={profile.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" value={profile.email} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
