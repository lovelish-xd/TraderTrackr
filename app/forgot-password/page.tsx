"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react"

export default function ForgetPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Call our API route to handle password reset
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          // Email not found
          toast({
            title: "Email Not Found",
            description: data.error,
            variant: "destructive",
          })
          return
        } else if (response.status === 429) {
          // Rate limited
          toast({
            title: "Too Many Requests",
            description: data.error,
            variant: "destructive",
          })
          return
        } else {
          // Other errors
          throw new Error(data.error || 'Failed to send password reset email')
        }
      }

      // Success
      setIsEmailSent(true)
      toast({
        title: "Reset Link Sent",
        description: "A password reset link has been sent to your email address.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!email) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Email Not Found",
            description: data.error,
            variant: "destructive",
          })
        } else if (response.status === 429) {
          toast({
            title: "Too Many Requests",
            description: data.error,
            variant: "destructive",
          })
        } else {
          throw new Error(data.error || 'Failed to resend email')
        }
        return
      }

      toast({
        title: "Email Resent",
        description: "Password reset link has been sent again to your email address.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Back Link */}


        {/* Main Card */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              {isEmailSent ? (
                <CheckCircle className="h-6 w-6 text-[#185E61]" />
              ) : (
                <Mail className="h-6 w-6 text-[#185E61]" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isEmailSent ? "Check Your Email" : "Forgot Password?"}
            </CardTitle>
            <CardDescription className="text-center">
              {isEmailSent
                ? "We've sent a password reset link to your email address."
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEmailSent ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-12"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#185E61] hover:bg-[#0f4c4e]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Send Reset Link
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-800">
                        Email sent successfully!
                      </p>
                      <p className="text-sm text-green-700">
                        We've sent a password reset link to <strong>{email}</strong>.
                        Click the link in the email to reset your password.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="w-full bg-[#185E61] hover:bg-[#0f4c4e] text-white transition-colors hover:text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent bg"></div>
                        Resending...
                      </div>
                    ) : (
                      "Resend Email"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Additional Help */}
            <div className="pt-4 border-t border-border/50">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Remember your password?
                </p>
                <Link
                  href="/login"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Need help? Contact our{" "}
            <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
