'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Menu } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Testimonials } from "@/components/ui/testimonials"
import { FAQs } from "@/components/ui/faqs"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Scroll animation hooks for each section
  const heroAnimation = useScrollAnimation<HTMLElement>(0.1, '0px 0px -50px 0px')
  const featuresAnimation = useScrollAnimation<HTMLElement>(0.1, '0px 0px -100px 0px')
  const testimonialsAnimation = useScrollAnimation<HTMLElement>(0.1, '0px 0px -100px 0px')
  const bannerAnimation = useScrollAnimation<HTMLElement>(0.1, '0px 0px -100px 0px')
  const faqsAnimation = useScrollAnimation<HTMLElement>(0.1, '0px 0px -100px 0px')
  
  // Hero section individual element animations
  const heroHeading = useScrollAnimation<HTMLHeadingElement>(0.1, '0px 0px -50px 0px')
  const heroSubheading = useScrollAnimation<HTMLParagraphElement>(0.1, '0px 0px -50px 0px')
  const heroButtons = useScrollAnimation<HTMLDivElement>(0.1, '0px 0px -50px 0px')
  const heroImage = useScrollAnimation<HTMLDivElement>(0.1, '0px 0px -50px 0px')
  
  // Individual feature card animations
  const featureCard1 = useScrollAnimation<HTMLDivElement>(0.1, '0px 0px -50px 0px')
  const featureCard2 = useScrollAnimation<HTMLDivElement>(0.1, '0px 0px -50px 0px')
  const featureCard3 = useScrollAnimation<HTMLDivElement>(0.1, '0px 0px -50px 0px')
  const featureCard4 = useScrollAnimation<HTMLDivElement>(0.1, '0px 0px -50px 0px')
  const featureCard5 = useScrollAnimation<HTMLDivElement>(0.1, '0px 0px -50px 0px')
  const featureCard6 = useScrollAnimation<HTMLDivElement>(0.1, '0px 0px -50px 0px')

  return (
    <div className="flex min-h-screen flex-col">
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
              <Link href="#features" className="hover:text-black font-medium transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="hover:text-black font-medium transition-colors">
                Testimonials
              </Link>
              <Link href="#faqs" className="hover:text-black font-medium transition-colors">
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
                  href="#features"
                  className=" font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#testimonials"
                  className=" font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link
                  href="#faqs"
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

      <main className="flex-1 relative bg-gradient-to-br from-[#F0FDFD] via-white to-[#185E61]/10">


        {/* Hero Section */}
        <section 
          ref={heroAnimation.elementRef}
          className={`relative w-full pt-32 md:pt-32 lg:pt-44 overflow-hidden z-10 transition-all duration-1000 ease-out ${
            heroAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                <h1 
                  ref={heroHeading.elementRef}
                  className={`text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-7xl drop-shadow-sm transition-all duration-1000 ease-out ${
                    heroHeading.isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  Track. Reflect. Grow.
                </h1>
                <p 
                  ref={heroSubheading.elementRef}
                  className={`text-lg text-[#7C8494] md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ease-out ${
                    heroSubheading.isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  A professional trading journal to help you track performance, identify patterns, and develop discipline over time.
                </p>
              </div>
              <div 
                ref={heroButtons.elementRef}
                className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-1000 ease-out ${
                  heroButtons.isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="px-5 py-4 text-lg bg-[#185E61] hover:bg-[#185E61]/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg border-2 border-[#185E61]20 hover:bg-[#185E61]/5 rounded-xl transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div 
              ref={heroImage.elementRef}
              className={`mt-12 w-full max-w-6xl mx-auto transition-all duration-1000 ease-out ${
                heroImage.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <Image
                src="/homepage.png"
                alt="Hero Illustration"
                width={1800}
                height={1100}
                className="w-full h-auto rounded-2xl"
                priority
              />
            </div>
          </div>
        </section>        
        
        {/* features section */}
        <section 
          id="features" 
          ref={featuresAnimation.elementRef}
          className={`w-full pt-20 relative z-10 transition-all duration-1000 ease-out ${
            featuresAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tight sm:text-4xl md:text-3xl lg:text-4xl">
                Built for Traders, Designed to Level You Up
              </h2>
              <p className="text-lg text-[#7C8494] md:text-xl lg:text-xl max-w-3xl leading-relaxed">
                Effortlessly journal your trades, uncover performance insights, and build discipline—TraderTrackr is your edge in the markets.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
            <div 
              ref={featureCard1.elementRef}
              className={`flex flex-col items-center space-y-2 rounded-lg p-4 transition-all duration-700 ease-out ${
                featureCard1.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0ms' }}
            >
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
              <h3 className="text-xl font-bold">User Management</h3>
              <p className="text-center text-[#7C8494]">
                Secure login with email or Google authentication and user-specific dashboards
              </p>
            </div>
            <div 
              ref={featureCard2.elementRef}
              className={`flex flex-col items-center space-y-2 rounded-lg p-4 transition-all duration-700 ease-out ${
                featureCard2.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
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
              <h3 className="text-xl font-bold ">Trade Entry</h3>
              <p className="text-center text-[#7C8494]">
                Comprehensive trade entry form with dynamic fields based on instrument type
              </p>
            </div>
            <div 
              ref={featureCard3.elementRef}
              className={`flex flex-col items-center space-y-2 rounded-lg p-4 transition-all duration-700 ease-out ${
                featureCard3.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
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
              <h3 className="text-xl font-bold ">Performance Metrics</h3>
              <p className="text-center text-[#7C8494]">
                Track win rate, average gain/loss, drawdown, and risk-reward ratio
              </p>
            </div>
            <div 
              ref={featureCard4.elementRef}
              className={`flex flex-col items-center space-y-2 rounded-lg p-4 transition-all duration-700 ease-out ${
                featureCard4.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
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
              <h3 className="text-xl font-bold ">Filtering & Search</h3>
              <p className="text-center text-[#7C8494]">
                Filter trades by instrument, date range, profit/loss, and strategy
              </p>
            </div>
            <div 
              ref={featureCard5.elementRef}
              className={`flex flex-col items-center space-y-2 rounded-lg p-4 transition-all duration-700 ease-out ${
                featureCard5.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
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
              <h3 className="text-xl font-bold">Visual Analytics</h3>
              <p className="text-center text-[#7C8494]">
                Visualize performance with charts, equity curves, and heatmaps
              </p>
            </div>
            <div 
              ref={featureCard6.elementRef}
              className={`flex flex-col items-center space-y-2 rounded-lg p-4 transition-all duration-700 ease-out ${
                featureCard6.isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
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
              <h3 className="text-xl font-bold">Export & Reports</h3>
              <p className="text-center text-[#7C8494]">
                Export your journal as CSV with custom date ranges
              </p>
            </div>
          </div>
        </section>


        {/* Testimonials Section */}
        <section 
          id="testimonials" 
          ref={testimonialsAnimation.elementRef}
          className={`pt-20 relative z-10 transition-all duration-1000 ease-out ${
            testimonialsAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Testimonials />
        </section>

        {/*banner section */}
        <section 
          ref={bannerAnimation.elementRef}
          className={`pt-20 px-4 md:px-6 relative z-10 transition-all duration-1000 ease-out ${
            bannerAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="container max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden text-center px-8 py-12 md:py-16 shadow-lg">
              {/* Background with patterns */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0C1F20] to-[#132829]"></div>

              {/* Dot pattern overlay */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `radial-gradient(circle, #185E61 1.5px, transparent 1.5px)`,
                  backgroundSize: '30px 30px',
                }}
              ></div>

              

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
                  Ready to take control of your trading?
                </h2>
                <Link href="/signup">
                  <Button className="bg-[#185E61] hover:bg-[#185E61]/90 text-white text-base md:text-lg font-semibold py-3 px-6 rounded-xl shadow-md transition-colors">
                    Get Started →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section 
          id="faqs" 
          ref={faqsAnimation.elementRef}
          className={`relative z-10 transition-all duration-1000 ease-out ${
            faqsAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <FAQs />
        </section>      </main>


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