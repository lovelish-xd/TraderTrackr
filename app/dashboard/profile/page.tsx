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
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    joined: "",
  })

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!userData.user) throw new Error("User not authenticated")
        setUser(userData.user)
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name,last_name,created_at")
          .eq("id", userData.user.id)
          .single()
        if (profileError && profileError.code !== "PGRST116") throw profileError
        setProfile({
          first_name: profileData?.first_name || userData.user.user_metadata?.first_name || "",
          last_name: profileData?.last_name || userData.user.user_metadata?.last_name || "",
          email: userData.user.email || "",
          country: userData.user.user_metadata?.country || "Not specified",
          joined: profileData?.created_at || userData.user.created_at || "",
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

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (!user) throw new Error("User not authenticated")
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        updated_at: new Date().toISOString(),
      })
      if (profileError) throw profileError
      await supabase.auth.updateUser({
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
      })
      setIsEditing(false)
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
      <div className="mx-auto max-w-2xl px-2 sm:px-0">
        <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span role="img" aria-label="Basic Info">🧾</span> Basic Info
              </CardTitle>
              <CardDescription>Edit your basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      autoComplete="given-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      autoComplete="family-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={profile.country} disabled className="bg-gray-100 dark:bg-gray-800" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span role="img" aria-label="Contact">📧</span> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" value={profile.email} disabled className="bg-gray-100 dark:bg-gray-800" />
            </CardContent>
          </Card>

          {/* Joined Date */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span role="img" aria-label="Joined">📅</span> Joined Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-gray-700">Joined: {profile.joined ? new Date(profile.joined).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}</span>
            </CardContent>
          </Card>

          {/* Edit/Save Button */}
          <div className="flex justify-end gap-2">
            {!isEditing ? (
              <Button type="button" onClick={handleEditToggle} className="px-6">
                Edit
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" onClick={handleEditToggle} className="px-6">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="px-6">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
