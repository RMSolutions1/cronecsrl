"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
  animationType?: "fade-up" | "fade-in" | "slide-left" | "slide-right"
  delay?: number
  background?: "default" | "muted" | "primary" | "gradient"
}

export function SectionWrapper({
  children,
  className,
  id,
  animationType = "fade-up",
  delay = 0,
  background = "default"
}: SectionWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const animationClasses = {
    "fade-up": "translate-y-8 opacity-0",
    "fade-in": "opacity-0",
    "slide-left": "-translate-x-8 opacity-0",
    "slide-right": "translate-x-8 opacity-0"
  }

  const backgroundClasses = {
    default: "bg-background",
    muted: "bg-muted/50",
    primary: "bg-primary text-primary-foreground",
    gradient: "bg-gradient-to-br from-primary/5 via-background to-accent/5"
  }

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "relative transition-all duration-700 ease-out",
        backgroundClasses[background],
        !isVisible && animationClasses[animationType],
        isVisible && "translate-x-0 translate-y-0 opacity-100",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  )
}
