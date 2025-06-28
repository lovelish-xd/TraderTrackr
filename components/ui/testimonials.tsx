"use client"

import { useRef } from "react"
import { useEffect } from "react"

const testimonials = [
  {
    name: "Ava Mitchell",
    username: "@ava_trades",
    text: "TraderTrackr helped me finally stick to my trading plan. The journaling and analytics features are game-changing. I can now spot my weaknesses and improve with confidence.",
    date: "Feb 10, 2025",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    name: "Jason Kim",
    username: "@jasonk_fx",
    text: "The clean UI, seamless trade logging, and performance metrics make TraderTrackr my daily go-to. It’s the trading journal I didn’t know I needed.",
    date: "Mar 28, 2025",
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    name: "Lena Torres",
    username: "@lenathechartist",
    text: "From strategy tracking to trade notes and screenshots — TraderTrackr gives me full clarity on my trading behavior. It's made me 10x more disciplined.",
    date: "Apr 05, 2025",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    name: "Noah Blake",
    username: "@noahbtrades",
    text: "I’ve used spreadsheets and apps before, but nothing comes close to how intuitive TraderTrackr is. It feels like it was built by traders, for traders.",
    date: "May 14, 2025",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
  },
  {
    name: "Sara Nguyen",
    username: "@saran_trader",
    text: "The analytics dashboard showed me patterns I wasn’t even aware of. Now I know exactly which setups make me money and which ones don’t.",
    date: "Jun 02, 2025",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "David O’Connell",
    username: "@doc_daytrader",
    text: "TraderTrackr helped me reduce overtrading by making me more mindful. Reviewing my trades visually has become part of my nightly routine.",
    date: "Jun 18, 2025",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
  },
  {
    name: "Emily Zhao",
    username: "@zhaoemily",
    text: "I love the screen recording feature — seeing how I executed a trade in real time has helped me level up my entries and exits.",
    date: "Jun 25, 2025",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
]


export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const startAnimation = () => {
      if (intervalRef.current) return // Don't start if already running
      
      intervalRef.current = setInterval(() => {
        // Calculate when we've scrolled through the first set of testimonials
        const singleSetWidth = container.scrollWidth / 2
        
        if (container.scrollLeft >= singleSetWidth) {
          // Reset to beginning seamlessly
          container.scrollLeft = 0
        } else {
          container.scrollLeft += 1
        }
      }, 20)
    }

    const stopAnimation = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Start the animation initially
    startAnimation()

    const handleMouseEnter = () => stopAnimation()
    const handleMouseLeave = () => startAnimation()

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      stopAnimation()
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])
  return (
    <section className="px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[#0f172a] ">
        TraderTrackr Through the Eyes of Real Traders
      </h2>

      <div
        className="flex space-x-6 overflow-x-auto scroll-smooth transition-all duration-500"
        ref={containerRef}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Render testimonials twice for seamless loop */}
        {[...testimonials, ...testimonials].map((t, index) => (
          <div
            key={index}
            className="min-w-[280px] sm:min-w-[320px] max-w-sm bg-white rounded-xl p-6 shadow-md flex-shrink-0 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.username}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{t.text}</p>
            <div className="flex items-center text-sm text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
              >
                <path d="M18 2H6a2 2 0 0 0-2 2v16l4-4h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
              </svg>
              {t.date}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
export { Testimonials }