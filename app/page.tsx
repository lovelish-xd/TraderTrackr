import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-[#185E61]/10 backdrop-blur supports-[backdrop-filter]:bg-[#FBFBFB]">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-[#185E61]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#185E61"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
            </svg>
            <span className="text-2xl">TraderTrackr</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-[#185E61] hover:bg-[#185E61]/10">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#185E61] hover:bg-[#185E61]/90 text-[#FBFBFB]">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-[#FBFBFB]">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-[#185E61] sm:text-5xl xl:text-6xl/none">
                    Track. Reflect. Grow.
                  </h1>
                  <p className="max-w-[600px] text-[#7C8494] md:text-xl">
                    A professional trading journal to help you track performance, identify patterns, and develop
                    discipline over time.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1.5 bg-[#185E61] hover:bg-[#185E61]/90 text-[#FBFBFB]">
                      Get Started
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="border-[#185E61] text-[#185E61] hover:bg-[#185E61]/10">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-[#185E61]/5 p-4 md:h-[450px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#185E61]/20 via-transparent to-[#FBFBFB]/50" />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-[#185E61]">Professional Trading Journal</h2>
                      <p className="text-[#7C8494]">
                        Track your trades, analyze performance, and improve your strategy
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-[#FBFBFB]/80 p-4 backdrop-blur">
                        <div className="text-2xl font-bold text-[#185E61]">Track</div>
                        <p className="text-sm text-[#7C8494]">
                          Record all your trades with detailed information
                        </p>
                      </div>
                      <div className="rounded-lg bg-[#FBFBFB]/80 p-4 backdrop-blur">
                        <div className="text-2xl font-bold text-[#185E61]">Analyze</div>
                        <p className="text-sm text-[#7C8494]">Visualize performance with charts and metrics</p>
                      </div>
                      <div className="rounded-lg bg-[#FBFBFB]/80 p-4 backdrop-blur">
                        <div className="text-2xl font-bold text-[#185E61]">Improve</div>
                        <p className="text-sm text-[#7C8494]">Identify patterns and optimize your strategy</p>
                      </div>
                      <div className="rounded-lg bg-[#FBFBFB]/80 p-4 backdrop-blur">
                        <div className="text-2xl font-bold text-[#185E61]">Export</div>
                        <p className="text-sm text-[#7C8494]">Download reports and share your progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#185E61]/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#185E61] sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-[#7C8494] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to track and improve your trading performance
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-[#185E61]/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#185E61"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#185E61]">User Management</h3>
                <p className="text-center text-[#7C8494]">
                  Secure login with email or Google authentication and user-specific dashboards
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-[#185E61]/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#185E61"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                    <path d="M12 11h4" />
                    <path d="M12 16h4" />
                    <path d="M8 11h.01" />
                    <path d="M8 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#185E61]">Trade Entry</h3>
                <p className="text-center text-[#7C8494]">
                  Comprehensive trade entry form with dynamic fields based on instrument type
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-[#185E61]/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#185E61"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#185E61]">Performance Metrics</h3>
                <p className="text-center text-[#7C8494]">
                  Track win rate, average gain/loss, drawdown, and risk-reward ratio
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-[#185E61]/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#185E61"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#185E61]">Filtering & Search</h3>
                <p className="text-center text-[#7C8494]">
                  Filter trades by instrument, date range, profit/loss, and strategy
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-[#185E61]/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#185E61"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 2v8" />
                    <path d="m4.93 10.93 1.41 1.41" />
                    <path d="M2 18h2" />
                    <path d="M20 18h2" />
                    <path d="m19.07 10.93-1.41 1.41" />
                    <path d="M22 22H2" />
                    <path d="m8 22 4-10 4 10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#185E61]">Visual Analytics</h3>
                <p className="text-center text-[#7C8494]">
                  Visualize performance with charts, equity curves, and heatmaps
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-[#185E61]/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#185E61"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#185E61]">Export & Reports</h3>
                <p className="text-center text-[#7C8494]">
                  Export your journal as CSV, Excel, or PDF with custom date ranges
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-[#185E61]/10 py-6 bg-[#FBFBFB]">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-[#7C8494] md:text-left">
            &copy; {new Date().getFullYear()} Trading Journal. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-[#7C8494] underline-offset-4 hover:text-[#185E61] hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-[#7C8494] underline-offset-4 hover:text-[#185E61] hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
