"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How does journaling my trades help improve performance?",
    answer: "Journaling helps you reflect on your trades, spot patterns in your wins and losses, and build consistency. TraderTrackr makes this process effortless with powerful visuals, tagging, and notes.",
  },
  {
    question: "How does TraderTrackr compare to other trading journals?",
    answer: "TraderTrackr stands out from other trading journals due to its user-friendly interface, powerful features, and customizable settings. It offers a comprehensive journaling system, visual analytics, export options, and customizable settings.",
  },
  {
    question: "Does TraderTrackr support screenshots?",
    answer: "Absolutely. You can upload screenshots to each trade entry, helping you review your mindset and execution in context.",
  },
  {
    question: "Is my data safe and private?",
    answer: "Yes. We use encrypted storage and secure authentication to keep your trading data protected. Your logs are private and only accessible to you.",
  },
  {
    question: "How can I contact TraderTrackr support?",
    answer: "If you have any questions or need help using TraderTrackr, you can contact support by going to the 'Support' section of your TraderTrackr account and selecting the appropriate option. You can also reach out to us via email at contact@tradertrackr.io.",
  },
]


export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faqs" className="py-16 px-4 ">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Questions? We’ve Got You.
        </h2>
        <p className="text-center mb-16">Explore our FAQs and get instant clarity.</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export { FAQs }