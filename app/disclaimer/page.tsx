'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Menu } from "lucide-react"
import { useState } from "react"

export default function Disclaimer() {
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
                Disclaimer
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Notice</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <p className="text-red-800 font-semibold text-lg mb-2">
                    ⚠️ Trading Risk Warning
                  </p>
                  <p className="text-red-700 leading-relaxed">
                    Trading financial instruments involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. This platform is for educational and journaling purposes only.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Financial Advice</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  TraderTrackr is a trading journal and analytics platform designed to help you track and analyze your trading performance. We do not provide:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Investment advice or recommendations</li>
                  <li>Trading signals or strategies</li>
                  <li>Financial planning or wealth management services</li>
                  <li>Tax, legal, or accounting advice</li>
                  <li>Predictions about market movements or specific investments</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Any information, data, or analysis provided through our platform is for informational and educational purposes only. It should not be considered as professional financial advice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Trading Risks</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Trading and investing in financial markets involves significant risks, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Market Risk:</strong> Prices can fluctuate rapidly and unpredictably</li>
                  <li><strong>Volatility Risk:</strong> High volatility can lead to substantial losses</li>
                  <li><strong>Liquidity Risk:</strong> Some instruments may be difficult to buy or sell</li>
                  <li><strong>Leverage Risk:</strong> Borrowed money amplifies both gains and losses</li>
                  <li><strong>Regulatory Risk:</strong> Changes in laws and regulations can affect investments</li>
                  <li><strong>Counterparty Risk:</strong> Risk of default by trading partners or brokers</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  You should never trade with money you cannot afford to lose. Consider your financial situation, risk tolerance, and investment objectives before trading.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Accuracy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  While we strive to provide accurate tools and calculations, TraderTrackr:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Cannot guarantee the accuracy of data entered by users</li>
                  <li>Does not verify the completeness of trading records</li>
                  <li>May contain calculation errors or software bugs</li>
                  <li>Relies on user-provided information for analysis</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for verifying the accuracy of your own trading records and any analysis generated by our platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Past Performance</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Historical trading performance displayed in your journal:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Does not guarantee future results</li>
                  <li>May not reflect actual market conditions</li>
                  <li>Should not be used as the sole basis for investment decisions</li>
                  <li>May include survivorship bias or other statistical biases</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Market conditions, regulations, and economic factors change over time, which can significantly impact trading performance.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Platform Limitations</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our platform has limitations that users should be aware of:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Technical issues may cause temporary unavailability</li>
                  <li>Data may be delayed or incomplete</li>
                  <li>Features may not work as expected in all scenarios</li>
                  <li>Analysis tools may not capture all market variables</li>
                  <li>Integration with external services may fail</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  We recommend maintaining backup records of your trading data and not relying solely on our platform for critical trading decisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Regulatory Compliance</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Trading regulations vary by jurisdiction. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Understanding applicable laws and regulations in your jurisdiction</li>
                  <li>Ensuring compliance with tax reporting requirements</li>
                  <li>Obtaining necessary licenses or registrations</li>
                  <li>Following broker and exchange rules</li>
                  <li>Adhering to anti-money laundering regulations</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  TraderTrackr is not responsible for your compliance with applicable regulations or laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Content</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our platform may include links to third-party websites, services, or content:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>We do not endorse or validate third-party content</li>
                  <li>Third-party services have their own terms and privacy policies</li>
                  <li>We are not responsible for third-party service availability or accuracy</li>
                  <li>Use third-party services at your own risk</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Professional Advice</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Before making any trading or investment decisions, you should consult with:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Licensed financial advisors</li>
                  <li>Tax professionals</li>
                  <li>Legal counsel</li>
                  <li>Certified public accountants</li>
                  <li>Other qualified professionals</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Professional advisors can help you understand the risks and suitability of trading strategies based on your individual circumstances.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To the maximum extent permitted by law, TraderTrackr and its affiliates shall not be liable for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Any trading losses or investment decisions</li>
                  <li>Missed opportunities or timing of trades</li>
                  <li>Technical failures or data corruption</li>
                  <li>Errors in calculations or analysis</li>
                  <li>Unauthorized access to your account</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Your use of our platform is at your own risk and discretion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this disclaimer from time to time to reflect:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Changes in applicable laws or regulations</li>
                  <li>Updates to our platform features</li>
                  <li>New risk factors or limitations</li>
                  <li>Legal or compliance requirements</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  We will notify users of material changes through our platform or via email.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions about this disclaimer or our platform:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> support@tradertrackr.io
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Subject:</strong> Disclaimer Inquiry
                  </p>
                  <p className="text-gray-700">
                    <strong>Note:</strong> We cannot provide personalized trading or investment advice
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acknowledgment</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-800 leading-relaxed">
                    By using TraderTrackr, you acknowledge that you have read, understood, and agree to this disclaimer. You understand that trading involves substantial risk and that you are solely responsible for your trading decisions and their outcomes.
                  </p>
                </div>
              </section>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-6">
                Ready to start tracking your trades responsibly?
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
