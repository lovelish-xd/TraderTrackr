'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Menu } from "lucide-react"
import { useState } from "react"

export default function TermsOfService() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full p-4">
        <div className="mx-auto max-w-6xl">
          <nav className="flex h-16 items-center justify-between rounded-2xl bg-white/80 px-6 backdrop-blur-md border border-white/20 shadow-lg">
            {/* Logo */}
            <div>
              <Link href="/"> <div className="flex items-center gap-2 font-bold text-[#185E61]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#185E61"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
                </svg>
                <span className="text-xl font-bold">TraderTrackr</span>
              </div></Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-16 text-gray-700 ">
              <Link href="/#features" className="hover:text-black font-medium transition-colors">
                Features
              </Link>
              <Link href="/#testimonials" className="hover:text-black font-medium transition-colors">
                Testimonials
              </Link>
              <Link href="/#faqs" className="hover:text-black font-medium transition-colors">
                FAQs
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-[#185E61] hover:bg-[#185E61]/10 font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#185E61] hover:bg-[#185E61]/90 text-white rounded-xl">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#185E61]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden">
              <div className="flex flex-col p-4 space-y-4">
                <Link
                  href="/#features"
                  className=" font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/#testimonials"
                  className=" font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link
                  href="/#faqs"
                  className=" font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQs
                </Link>
                <div className="flex flex-col gap-2 pt-2 border-t border-[#185E61]/10">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full text-[#185E61] hover:bg-[#185E61]/10 font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-[#185E61] hover:bg-[#185E61]/90 text-white rounded-xl">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative bg-gradient-to-br from-[#F0FDFD] via-white to-[#185E61]/10">
        <div className="container mx-auto px-4 md:px-6 py-32 max-w-4xl">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your use of TraderTrackr's trading journal application and related services ("Service") operated by TraderTrackr ("we," "our," or "us").
              </p>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TraderTrackr provides a digital platform for traders to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Record and track trading activities and performance</li>
                <li>Analyze trading patterns and generate insights</li>
                <li>Store and organize trading journal entries</li>
                <li>Access performance analytics and reporting tools</li>
                <li>Export trading data and reports</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Registration and Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use our Service, you must:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for safeguarding the password and for all activities that happen under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Upload malicious code, viruses, or other harmful content</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or store personal data about other users</li>
                <li>Use the Service to transmit spam or unsolicited communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Content and Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You retain ownership of all content and data you submit to the Service, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Trading journal entries and notes</li>
                <li>Trade data and performance metrics</li>
                <li>Personal preferences and settings</li>
                <li>Any other content you create or upload</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                By submitting content to the Service, you grant us a limited, non-exclusive license to use, store, and process your content solely for the purpose of providing the Service to you.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for the accuracy and legality of your content and warrant that you have the right to submit it to our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Subscription and Payment Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our Service may be offered on a subscription basis with the following terms:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Subscription fees are billed in advance on a recurring basis</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We may change subscription fees with 30 days' notice</li>
                <li>You may cancel your subscription at any time</li>
                <li>Upon cancellation, your access will continue until the end of your billing period</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by TraderTrackr and are protected by:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Copyright, trademark, and other intellectual property laws</li>
                <li>International copyright treaties and conventions</li>
                <li>Other proprietary rights and unfair competition laws</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You may not reproduce, distribute, modify, or create derivative works of our Service without express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimers and Limitations</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed font-medium">
                  <strong>Financial Disclaimer:</strong> TraderTrackr is a journaling and analytics tool only. We do not provide financial advice, investment recommendations, or trading signals. All trading decisions are your own responsibility.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Accuracy, reliability, or completeness of information</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Security or data protection</li>
                <li>Fitness for a particular purpose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, TraderTrackr shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Trading losses or investment decisions</li>
                <li>Service interruptions or data loss</li>
                <li>Third-party actions or content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Breach of these Terms</li>
                <li>Violation of applicable laws</li>
                <li>Fraudulent or harmful activity</li>
                <li>Extended periods of inactivity</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to use the Service will cease immediately. You may request data export before account closure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Backup and Export</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we maintain regular backups, you are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Regularly exporting your important data</li>
                <li>Maintaining your own backup copies</li>
                <li>Requesting data export before account termination</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction where TraderTrackr is incorporated, without regard to its conflict of law provisions. Any disputes arising from these Terms will be resolved through binding arbitration or in the courts of that jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of significant changes by:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Posting the new Terms on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notification for material changes</li>
                <li>Providing in-app notifications when you next access the Service</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> legal@tradertrackr.io
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Subject:</strong> Terms of Service Inquiry
                </p>
                <p className="text-gray-700">
                  <strong>Response Time:</strong> We typically respond within 48 hours
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions will remain in effect. This Terms of Service constitutes the entire agreement between us regarding our Service.
              </p>
            </section>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-6">
              Ready to start your trading journey with TraderTrackr?
            </p>
            <Link href="/signup">
              <Button className="bg-[#185E61] hover:bg-[#185E61]/90 text-white px-8 py-3 rounded-xl font-semibold">
                Get Started Now
              </Button>
            </Link>
          </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#185E61] text-white">
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
                </svg>
                <span className="text-xl font-bold">TraderTrackr</span>
              </div>
              <p className="text-white/70 text-sm">
                &copy; {new Date().getFullYear()} TraderTrackr. All rights reserved.
              </p>
            </div>
            {/* Product Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/#features" className="text-white/70 hover:text-white transition-colors text-sm">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#testimonials" className="text-white/70 hover:text-white transition-colors text-sm">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="text-white/70 hover:text-white transition-colors text-sm">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            {/* Support Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="mailto:contact@tradertrackr.io" className="text-white/70 hover:text-white transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/#faqs" className="text-white/70 hover:text-white transition-colors text-sm">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-white/70 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/70 hover:text-white transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-white/70 hover:text-white transition-colors text-sm">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-white/70 hover:text-white transition-colors text-sm">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
