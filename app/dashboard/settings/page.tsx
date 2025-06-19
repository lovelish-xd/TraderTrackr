"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter as DialogFooterBase, DialogClose } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "INR", label: "INR (₹)" }
]

export default function SettingsPage() {
  const { toast } = useToast()
  const [tradeSummaryEmails, setTradeSummaryEmails] = useState(true)
  const [currency, setCurrency] = useState("USD")
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [show2FADialog, setShow2FADialog] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  // Fetch user email on mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user?.email) {
        setEmail(data.user.email)
      }
    }
    fetchUserEmail()
  }, [])


  const handleResetPassword = async () => {
    if (!email) {
      toast({ title: "Error", description: "No email found for your account." })
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/update-password',
    })
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
      return
    }
    toast({ title: "Password reset link sent", description: "Check your email to reset your password." })
  }
  const handleEnable2FA = () => {
    setShow2FADialog(false)
    toast({ title: "2FA Enabled", description: "Two-factor authentication is now enabled." })
  }
  const handleClearData = async () => {
    const { error } = await supabase
      .from("trades")
      .delete()
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
      return
    }
    setShowClearDialog(false)
    toast({ title: "Trade Data Cleared", description: "All your trade data has been deleted." })
  }
  const handleDeleteAccount = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) {
      toast({ title: "Error", description: error?.message || "User not found", variant: "destructive" })
      return
    }
    const userId = data.user.id
    // Delete all user data 
    const { error: tradesError } = await supabase.from("trades").delete().eq("user_id", userId)
    if (tradesError) {
      toast({ title: "Error", description: tradesError.message, variant: "destructive" })
      return
    }
    // Delete user account
    const res = await fetch('/api/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: data.user.id })
    });
    const result = await res.json();
    if (res.ok) {
      toast({ title: "Account Deleted", description: "Your account has been deleted." })
      setTimeout(() => {
        window.location.href = "/"
      }, 1500)
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
    
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Reset Password</Label>
                <p className="text-sm text-muted-foreground">Send a password reset link to your email</p>
              </div>
              <Button variant="outline" onClick={handleResetPassword}>
                Reset
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication (2FA)</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">Enable 2FA</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                      Scan the QR code with your authenticator app and enter the code to enable 2FA.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="h-24 w-24 bg-muted rounded flex items-center justify-center text-muted-foreground">
                      QR
                    </div>
                    <input
                      className="w-full rounded border px-3 py-2 text-sm bg-background"
                      placeholder="Enter 2FA code"
                    />
                  </div>
                  <DialogFooterBase>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleEnable2FA}>Enable</Button>
                  </DialogFooterBase>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Control your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tradeSummaryEmails">Monthly Trade Summary Emails</Label>
                <p className="text-sm text-muted-foreground">Receive a monthly summary of your trades via email</p>
              </div>
              <Switch
                id="tradeSummaryEmails"
                checked={tradeSummaryEmails}
                onCheckedChange={setTradeSummaryEmails}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Personalize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="currency">Default Trading Currency</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred trading currency</p>
              </div>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your data and account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Clear All Trade Data</Label>
                <p className="text-sm text-muted-foreground">Remove all your trade records. This cannot be undone.</p>
              </div>
              <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Clear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Trade Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your trade data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleClearData}
                    >
                      Clear Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Delete Account</Label>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
              </div>
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all data. This action cannot be undone.
                      <br />
                      <span className="font-bold text-red-600">Are you absolutely sure?</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete My Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
