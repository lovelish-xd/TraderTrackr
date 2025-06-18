"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
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
    joined: "",
    avatar_url: "",
  })
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!userData.user) throw new Error("User not authenticated")
        setUser(userData.user)
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name,last_name,avatar_url,created_at")
          .eq("id", userData.user.id)
          .single()
        if (profileError && profileError.code !== "PGRST116") throw profileError
        setProfile({
          first_name: profileData?.first_name || userData.user.user_metadata?.first_name || "",
          last_name: profileData?.last_name || userData.user.user_metadata?.last_name || "",
          email: userData.user.email || "",
          joined: profileData?.created_at || userData.user.created_at || "",
          avatar_url: profileData?.avatar_url || "",
        })
        setAvatarPreview(profileData?.avatar_url || "")
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (!user) throw new Error("User not authenticated")
      let avatar_url = profile.avatar_url
      if (avatarFile) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`${user.id}/${avatarFile.name}`, avatarFile, { upsert: true })
        if (error) throw error
        avatar_url = data?.path ? supabase.storage.from("avatars").getPublicUrl(data.path).data.publicUrl : avatar_url
      }
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (profileError) throw profileError
      await supabase.auth.updateUser({
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
      })
      setProfile((prev) => ({ ...prev, avatar_url }))
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
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="flex flex-col items-center">
                  <div className="relative h-20 w-20 rounded-full bg-muted shadow">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile Preview"
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-3xl text-gray-400">
                        {profile.first_name?.[0] || "?"}
                      </div>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow hover:bg-primary/90"
                        onClick={() => fileInputRef.current?.click()}
                        tabIndex={-1}
                      >
                        <span className="sr-only">Upload</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
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
              <Input id="email" name="email" value={profile.email} disabled className="bg-gray-100" />
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
              <Button type="button" onClick={handleEditToggle} className="rounded-full px-6">
                Edit
              </Button>
            ) : (
              <Button type="submit" disabled={isSaving} className="rounded-full px-6">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
