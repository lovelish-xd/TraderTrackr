'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function CookiePolicy() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full p-4">
        <div className="mx-auto max-w-6xl">
          <nav className="flex h-16 items-center justify-between rounded-2xl bg-white/80 px-6 backdrop-blur-md border border-white/20 shadow-lg">
            <Link href="/">
              <div className="flex items-center gap-2 font-bold text-[#185E61]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#185E61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" viewBox="0 0 24 24">
                  <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
                </svg>
                <span className="text-xl font-bold">TraderTrackr</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-16 text-gray-700">
              <Link href="/#features" className="hover:text-black font-medium transition-colors">Features</Link>
              <Link href="/#testimonials" className="hover:text-black font-medium transition-colors">Testimonials</Link>
              <Link href="/#faqs" className="hover:text-black font-medium transition-colors">FAQs</Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login"><Button variant="ghost" className="text-[#185E61] hover:bg-[#185E61]/10 font-medium">Login</Button></Link>
              <Link href="/signup"><Button className="bg-[#185E61] hover:bg-[#185E61]/90 text-white rounded-xl">Sign Up</Button></Link>
            </div>

            <button className="md:hidden p-2 text-[#185E61]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>
          </nav>

          {isMenuOpen && (
            <div className="md:hidden mt-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden">
              <div className="flex flex-col p-4 space-y-4">
                <Link href="/#features" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>Features</Link>
                <Link href="/#testimonials" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>Testimonials</Link>
                <Link href="/#faqs" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>FAQs</Link>
                <div className="flex flex-col gap-2 pt-2 border-t border-[#185E61]/10">
                  <Link href="/login"><Button variant="ghost" className="w-full text-[#185E61] hover:bg-[#185E61]/10 font-medium">Login</Button></Link>
                  <Link href="/signup"><Button className="w-full bg-[#185E61] hover:bg-[#185E61]/90 text-white rounded-xl">Sign Up</Button></Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative bg-gradient-to-br from-[#F0FDFD] via-white to-[#185E61]/10">
        <div className="container mx-auto px-4 md:px-6 py-32 max-w-4xl">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
              <p className="text-lg text-gray-600">
                Last updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
                <p>
                  Cookies are small text files stored on your device by your browser. They help websites recognize your device and remember information about your visit, such as your preferences and settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
                <p>TraderTrackr uses cookies to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Maintain user sessions and authentication</li>
                  <li>Improve website functionality and user experience</li>
                  <li>Understand how visitors use our platform</li>
                  <li>Store user preferences like theme or layout</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for core functionality like login and security.</li>
                  <li><strong>Performance Cookies:</strong> Help us measure and improve platform performance.</li>
                  <li><strong>Preference Cookies:</strong> Store user preferences and interface customizations.</li>
                  <li><strong>Analytics Cookies:</strong> Collect data about user behavior to improve features.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
                <p>
                  Most browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Delete cookies stored on your device</li>
                  <li>Block all or selected types of cookies</li>
                  <li>Receive alerts before cookies are stored</li>
                </ul>
                <p>
                  Note that disabling cookies may affect the functionality of TraderTrackr.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
                <p>
                  We may use third-party services (like analytics or authentication) that set their own cookies. These cookies are subject to the third parties' own privacy and cookie policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
                <p>
                  We may update this cookie policy from time to time. Changes will be posted on this page, and significant updates will be communicated via email or platform notifications.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p>If you have any questions regarding our use of cookies:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> support@tradertrackr.io</p>
                  <p><strong>Subject:</strong> Cookie Policy</p>
                </div>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                You can manage your cookie preferences at any time in your browser settings.
              </p>
              <Link href="/privacy" className="inline-block text-[#185E61] font-medium hover:underline transition-colors">
                Learn more about our Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#185E61] text-white">
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" viewBox="0 0 24 24">
                  <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
                </svg>
                <span className="text-xl font-bold">TraderTrackr</span>
              </div>
              <p className="text-white/70 text-sm">
                &copy; {new Date().getFullYear()} TraderTrackr. All rights reserved.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/#features" className="text-white/70 hover:text-white transition-colors text-sm">Features</Link></li>
                <li><Link href="/#testimonials" className="text-white/70 hover:text-white transition-colors text-sm">Testimonials</Link></li>
                <li><Link href="/dashboard" className="text-white/70 hover:text-white transition-colors text-sm">Dashboard</Link></li>
                <li><Link href="/analytics" className="text-white/70 hover:text-white transition-colors text-sm">Analytics</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">Help Center</Link></li>
                <li><Link href="mailto:contact@tradertrackr.io" className="text-white/70 hover:text-white transition-colors text-sm">Contact Us</Link></li>
                <li><Link href="/#faqs" className="text-white/70 hover:text-white transition-colors text-sm">FAQs</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-white/70 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/70 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-white/70 hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
                <li><Link href="/disclaimer" className="text-white/70 hover:text-white transition-colors text-sm">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
