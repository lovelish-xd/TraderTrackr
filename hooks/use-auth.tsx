"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      
      try {
        // First check if there's an active session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !sessionData.session) {
          window.location.href = '/login'
          return
        }

        // Then get user data
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        // Check if user is authenticated
        if (userError || !userData.user?.id) {
          // Redirect to login if not authenticated
          window.location.href = '/login'
          return
        }
        
        setUserId(userData.user.id)
        setIsAuthenticated(true)

      } catch (error) {
        console.error('Authentication error:', error)
        // If there's an auth error, redirect to login
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = (error as { message: string }).message
          if (errorMessage.includes('Auth session missing') || errorMessage.includes('JWT')) {
            window.location.href = '/login'
            return
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isLoading, isAuthenticated, userId }
}
