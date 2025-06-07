"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  BarChart3,
  Calendar,
  CreditCard,
  Home,
  LineChart,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  UserIcon,
  X,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Error fetching user:", error)
        return
      }
      setUser(data.user)
      setIsLoading(false)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Trades", href: "/dashboard/trades", icon: BarChart3 },
    { name: "Add Trade", href: "/dashboard/trades/new", icon: PlusCircle },
    { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  ]

  const userNavigation = [
    { name: "Your Profile", href: "/dashboard/profile", icon: UserIcon },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">You are not logged in</h1>
        <p className="text-muted-foreground">Please log in to access the dashboard</p>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile navigation overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs overflow-y-auto bg-background p-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[#185E61]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
                </svg>
                <span>TraderTrackr</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="divide-y divide-muted">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium ${
                        pathname === item.href
                          ? "bg-[#185E61] text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2 py-6">
                  {userNavigation.map((item) => (
                    <Link
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium ${
                      pathname === item.href
                        ? "bg-[#185E61] text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Button
                    variant="ghost"
                    className="-mx-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-6 w-6 shrink-0" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden border-r bg-muted/40 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 py-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[#185E61]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
              </svg>
              <span>TraderTrackr</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm font-medium ${
                          pathname === item.href
                            ? "bg-[#185E61] text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            pathname === item.href
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold text-muted-foreground">Your account</div>
                <ul className="-mx-2 mt-2 space-y-1">
                  {userNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm font-medium ${
                          pathname === item.href
                            ? "bg-[#185E61] text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            pathname === item.href
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="-m-2.5 p-2.5 lg:hidden"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-muted" />
              <div className="flex items-center gap-2">
                <div className="hidden text-sm font-medium lg:block">{user.email}</div>
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <Link href="/dashboard/profile">
                    <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                        {user.email ? user.email[0].toUpperCase() : "U"}
                      </span>
                    </span>
                    <span className="sr-only">View profile</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
