"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      // Wait for Supabase to pick up the session
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.replace("/login")
        return
      }
      // Check if profile exists
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      if (profile) {
        router.replace("/dashboard")
      } else {
        router.replace("/complete-profile")
      }
    }
    checkProfileAndRedirect()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-muted-foreground">Signing you in...</span>
    </div>
  )
}
