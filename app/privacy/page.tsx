'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Menu } from "lucide-react"
import { useState } from "react"

export default function PrivacyPolicy() {
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
                Privacy Policy
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  TraderTrackr ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our trading journal platform and related services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect personal information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Name and contact information (email address)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information and preferences</li>
                  <li>Payment information (processed by third-party payment processors)</li>
                  <li>Communication preferences and settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Trading Data</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  As a trading journal platform, we collect and store:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Trading journal entries and notes</li>
                  <li>Trade execution data (symbols, prices, dates, quantities)</li>
                  <li>Performance metrics and analytics</li>
                  <li>Custom tags, categories, and strategies</li>
                  <li>Uploaded charts, screenshots, and documents</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We automatically collect information about how you use our Service:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Log files and error reports</li>
                  <li>Session duration and frequency of use</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Providing, maintaining, and improving our Service</li>
                  <li>Processing transactions and managing your account</li>
                  <li>Personalizing your experience and preferences</li>
                  <li>Generating analytics and performance insights</li>
                  <li>Communicating with you about your account and our services</li>
                  <li>Providing customer support and technical assistance</li>
                  <li>Detecting and preventing fraud, abuse, or security issues</li>
                  <li>Complying with legal obligations and regulatory requirements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this Privacy Policy:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may share information with trusted third-party service providers who assist us in:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Cloud hosting and data storage</li>
                  <li>Payment processing</li>
                  <li>Email delivery and communication</li>
                  <li>Analytics and performance monitoring</li>
                  <li>Customer support services</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may disclose your information if required to do so by law or if we believe such action is necessary to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Comply with legal obligations or court orders</li>
                  <li>Protect our rights, property, or safety</li>
                  <li>Protect the rights, property, or safety of our users</li>
                  <li>Prevent fraud or other illegal activities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee training on data protection practices</li>
                  <li>Incident response and breach notification procedures</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your information for as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Account information: Until you delete your account or request deletion</li>
                  <li>Trading data: As long as your account remains active</li>
                  <li>Usage logs: Typically 12-24 months</li>
                  <li>Financial records: As required by applicable laws (typically 7 years)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  You can request deletion of your personal information at any time, subject to legal and contractual obligations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request export of your data in a portable format</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Essential cookies:</strong> Required for basic functionality</li>
                  <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Analytics cookies:</strong> Help us understand usage patterns</li>
                  <li><strong>Marketing cookies:</strong> Used for targeted advertising (with consent)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  You can control cookie settings through your browser preferences. Some features may not work properly if you disable cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Third-party services we may use include payment processors, analytics providers, and cloud storage services. Each has their own privacy policies and terms of service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Transfers</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Adequacy decisions by relevant authorities</li>
                  <li>Standard contractual clauses</li>
                  <li>Binding corporate rules</li>
                  <li>Certification schemes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending email notifications for material changes</li>
                  <li>Displaying in-app notifications</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Your continued use of our Service after any changes constitutes acceptance of the new Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> privacy@tradertrackr.io
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Subject:</strong> Privacy Policy Inquiry
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Data Protection Officer:</strong> dpo@tradertrackr.io
                  </p>
                  <p className="text-gray-700">
                    <strong>Response Time:</strong> We typically respond within 72 hours
                  </p>
                </div>
              </section>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-6">
                Ready to start your trading journey with confidence?
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

      {/* Footer */}
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