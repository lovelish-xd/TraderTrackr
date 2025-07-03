'use client'
import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1, 
  rootMargin = '0px 0px -100px 0px'
) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once visible, we don't need to observe anymore
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [threshold, rootMargin])

  return { elementRef, isVisible }
}
