"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Users,
  Target,
  MessageSquare,
  BarChart3,
  FileText,
  Calendar,
  Shield,
  CheckCircle,
  Star,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const benefitsRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero animations
      // gsap.fromTo(".hero-title", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })

      // gsap.fromTo(
      //   ".hero-subtitle",
      //   { opacity: 0, y: 50 },
      //   { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" },
      // )

      // gsap.fromTo(
      //   ".hero-cta",
      //   { opacity: 0, y: 30 },
      //   { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: "power3.out" },
      // )

      // // Enhanced floating animations with complex paths
      // gsap.to(".floating-1", {
      //   motionPath: {
      //     path: "M0,0 Q50,-30 100,0 T200,0",
      //     autoRotate: true,
      //   },
      //   duration: 8,
      //   repeat: -1,
      //   ease: "none",
      // })

      // gsap.to(".floating-1", {
      //   scale: 1.2,
      //   duration: 2,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "power2.inOut",
      // })

      // gsap.to(".floating-1", {
      //   rotation: 360,
      //   duration: 12,
      //   repeat: -1,
      //   ease: "none",
      // })

      // // Pulsing and morphing animation for floating-2
      // gsap.to(".floating-2", {
      //   y: -25,
      //   x: 15,
      //   duration: 3,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "sine.inOut",
      //   delay: 0.5,
      // })

      // gsap.to(".floating-2", {
      //   scale: 0.8,
      //   duration: 1.5,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "power2.inOut",
      //   delay: 1,
      // })

      // gsap.to(".floating-2", {
      //   borderRadius: "50% 20% 50% 20%",
      //   duration: 4,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "power2.inOut",
      // })

      // // Complex orbital motion for floating-3
      // gsap.to(".floating-3", {
      //   motionPath: {
      //     path: "M0,0 A30,30 0 1,1 0,1 A30,30 0 1,1 0,0",
      //     autoRotate: false,
      //   },
      //   duration: 6,
      //   repeat: -1,
      //   ease: "none",
      //   delay: 1,
      // })

      // gsap.to(".floating-3", {
      //   rotation: -360,
      //   duration: 3,
      //   repeat: -1,
      //   ease: "none",
      // })

      // gsap.to(".floating-3", {
      //   skewX: 15,
      //   skewY: 5,
      //   duration: 2,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "power2.inOut",
      // })

      // // Additional floating shapes with unique animations
      // gsap.to(".floating-4", {
      //   motionPath: {
      //     path: "M0,0 Q-50,-20 -100,0 Q-150,20 -200,0",
      //     autoRotate: false,
      //   },
      //   duration: 4,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "power2.inOut",
      // })

      // gsap.to(".floating-4", {
      //   scale: 0.8,
      //   duration: 2,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "sine.inOut",
      // })

      // gsap.to(".floating-4", {
      //   opacity: 0.4,
      //   duration: 1.5,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "power2.inOut",
      // })

      // gsap.to(".floating-5", {
      //   motionPath: {
      //     path: "M0,0 C20,-40 80,-40 100,0 C80,40 20,40 0,0",
      //     autoRotate: true,
      //   },
      //   duration: 10,
      //   repeat: -1,
      //   ease: "none",
      // })

      // gsap.to(".floating-6", {
      //   y: -30,
      //   rotation: 720,
      //   transformOrigin: "center center",
      //   duration: 8,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "back.inOut(1.7)",
      // })

      // // Morphing background gradients
      // gsap.to(".morph-bg-1", {
      //   scale: 1.5,
      //   rotation: 45,
      //   borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
      //   duration: 8,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "sine.inOut",
      // })

      // gsap.to(".morph-bg-2", {
      //   scale: 0.7,
      //   rotation: -90,
      //   borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
      //   duration: 6,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "power2.inOut",
      // })

      // gsap.to(".morph-bg-3", {
      //   scaleX: 1.8,
      //   scaleY: 0.6,
      //   rotation: 180,
      //   borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
      //   duration: 10,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "elastic.inOut(1, 0.5)",
      // })

      // // Features section animations
      // gsap.fromTo(
      //   ".feature-card",
      //   { opacity: 0, y: 80, scale: 0.9 },
      //   {
      //     opacity: 1,
      //     y: 0,
      //     scale: 1,
      //     duration: 0.8,
      //     stagger: 0.2,
      //     ease: "power3.out",
      //     scrollTrigger: {
      //       trigger: ".features-grid",
      //       start: "top 80%",
      //       end: "bottom 20%",
      //     },
      //   },
      // )

      // // Benefits section animations
      // gsap.fromTo(
      //   ".benefit-item",
      //   { opacity: 0, x: -50 },
      //   {
      //     opacity: 1,
      //     x: 0,
      //     duration: 0.8,
      //     stagger: 0.15,
      //     ease: "power3.out",
      //     scrollTrigger: {
      //       trigger: ".benefits-list",
      //       start: "top 80%",
      //     },
      //   },
      // )

      // // Stats animation
      // gsap.fromTo(
      //   ".stat-number",
      //   { opacity: 0, scale: 0.5 },
      //   {
      //     opacity: 1,
      //     scale: 1,
      //     duration: 0.6,
      //     stagger: 0.1,
      //     ease: "back.out(1.7)",
      //     scrollTrigger: {
      //       trigger: ".stats-section",
      //       start: "top 80%",
      //     },
      //   },
      // )

      // // CTA section animation
      // gsap.fromTo(
      //   ".cta-content",
      //   { opacity: 0, y: 50 },
      //   {
      //     opacity: 1,
      //     y: 0,
      //     duration: 1,
      //     ease: "power3.out",
      //     scrollTrigger: {
      //       trigger: ".cta-section",
      //       start: "top 80%",
      //     },
      //   },
      // )

      // // Enhanced parallax effect for background elements
      // gsap.to(".bg-gradient-1", {
      //   yPercent: -50,
      //   rotation: 45,
      //   ease: "none",
      //   scrollTrigger: {
      //     trigger: "body",
      //     start: "top bottom",
      //     end: "bottom top",
      //     scrub: true,
      //   },
      // })

      // gsap.to(".bg-gradient-2", {
      //   yPercent: -30,
      //   rotation: -30,
      //   ease: "none",
      //   scrollTrigger: {
      //     trigger: "body",
      //     start: "top bottom",
      //     end: "bottom top",
      //     scrub: true,
      //   },
      // })
    })

    return () => ctx.revert()
  }, []) // Removed mobileMenuOpen dependency

  // Separate useEffect for mobile menu animation
  useEffect(() => {
    if (typeof window === "undefined") return

    if (mobileMenuOpen) {
      gsap.fromTo(
        ".mobile-menu-slide",
        {
          x: "100%",
        },
        {
          x: "0%",
          duration: 0.5,
          ease: "power3.out",
        },
      )
    }
  }, [mobileMenuOpen])

  const features = [
    {
      icon: Target,
      title: "Goal-Driven Projects",
      description:
        "Set clear goals, milestones, and deadlines with visual progress tracking and automated completion calculations.",
    },
    {
      icon: Users,
      title: "Multi-Tenant Collaboration",
      description: "Seamless collaboration between clients and creators with role-based access and permissions.",
    },
    {
      icon: MessageSquare,
      title: "Smart Feedback System",
      description: "Structured feedback threads tied to specific goals and tasks with real-time status updates.",
    },
    {
      icon: BarChart3,
      title: "Live Dashboards",
      description: "Real-time project insights with progress charts, activity feeds, and completion trends.",
    },
    {
      icon: FileText,
      title: "File Management",
      description: "Version-controlled deliverables with preview capabilities and delivery tracking.",
    },
    {
      icon: Calendar,
      title: "Timeline Views",
      description: "Gantt-style project timelines with drag-and-drop task scheduling and milestone tracking.",
    },
  ]

  const benefits = [
    "Eliminate project miscommunication",
    "Reduce revision cycles by 60%",
    "Increase client satisfaction scores",
    "Streamline project delivery",
    "Boost team productivity",
    "Maintain project transparency",
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    // Smooth scroll to section
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Enhanced Background Elements with Morphing */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="morph-bg-1 bg-gradient-1 absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="morph-bg-2 bg-gradient-2 absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="morph-bg-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>

        {/* Additional morphing background elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-300/15 to-yellow-300/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-tr from-green-300/15 to-blue-300/15 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 px-4 lg:px-6 h-16 flex items-center backdrop-blur-sm bg-white/80 border-b border-gray-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ClientAlign
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">
              Benefits
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Get Started
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Slide-in Panel Design */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide Panel */}
          <div className="mobile-menu-slide fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 z-50 md:hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">CA</span>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ClientAlign
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <div className="p-6">
              <nav className="space-y-1">
                <a
                  href="#features"
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                  onClick={(e) => handleNavClick(e, "#features")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">Features</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </a>

                <a
                  href="#benefits"
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                  onClick={(e) => handleNavClick(e, "#benefits")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">Benefits</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </a>

                <a
                  href="#pricing"
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                  onClick={(e) => handleNavClick(e, "#pricing")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <BarChart3 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-900">Pricing</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </a>

                <a
                  href="#contact"
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                  onClick={(e) => handleNavClick(e, "#contact")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                      <MessageSquare className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span className="font-medium text-gray-900">Contact</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-600 transition-colors" />
                </a>
              </nav>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center text-gray-700 border-gray-200 hover:bg-gray-50"
                >
                  Sign In
                </Button>
                <Button
                  size="lg"
                  className="w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Footer Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Enterprise Security</span>
                </div>
                <p className="text-xs text-gray-600">
                  Your data is protected with bank-level encryption and security protocols.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 pt-20 pb-32 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="hero-subtitle mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
              🚀 The Future of Client-Creator Collaboration
            </Badge>

            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              Bridge the Gap Between
              <span className="block">Clients & Creators</span>
            </h1>

            <p className="hero-subtitle text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              ClientAlign is the multi-tenant collaboration platform that aligns clients and creators around shared
              project goals, milestones, and transparent progress tracking.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-gray-300 hover:border-blue-400 hover:text-blue-600"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Enhanced Floating Elements with Complex Animations */}
          {/* <div className="absolute top-20 left-10 floating-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-20 rotate-12 shadow-lg"></div>
          </div>
          <div className="absolute top-40 right-20 floating-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-30 shadow-md"></div>
          </div>
          <div className="absolute bottom-20 left-1/4 floating-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg opacity-25 rotate-45 shadow-sm"></div>
          </div>

          <div className="absolute top-[180px] left-1/2 transform -translate-x-1/2 floating-4">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
            </div>
          </div>
          <div className="absolute bottom-40 right-10 floating-5">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-xl opacity-20 rotate-12"></div>
          </div>
          <div className="absolute top-1/2 left-20 floating-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl opacity-15 transform rotate-45"></div>
          </div>

          <div className="absolute top-16 left-1/3">
            <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-pink-400 transform rotate-45 opacity-30 animate-bounce"></div>
          </div>
          <div className="absolute bottom-32 left-1/2">
            <div className="w-3 h-12 bg-gradient-to-t from-blue-400 to-cyan-400 rounded-full opacity-25 animate-pulse"></div>
          </div>
          <div className="absolute top-1/3 right-16">
            <div className="w-8 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"></div>
          </div> */}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-number">
              <div className="text-4xl font-bold text-blue-600 mb-2">60%</div>
              <div className="text-gray-600">Fewer Revisions</div>
            </div>
            <div className="stat-number">
              <div className="text-4xl font-bold text-purple-600 mb-2">10x</div>
              <div className="text-gray-600">Faster Delivery</div>
            </div>
            <div className="stat-number">
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div className="stat-number">
              <div className="text-4xl font-bold text-cyan-600 mb-2">24/7</div>
              <div className="text-gray-600">Project Visibility</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="relative z-10 py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">✨ Powerful Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Everything You Need for
              <span className="block">Seamless Collaboration</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From goal tracking to file management, ClientAlign provides all the tools you need to deliver exceptional
              client experiences.
            </p>
          </div>

          <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="feature-card group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        ref={benefitsRef}
        className="relative z-10 py-24 px-4 bg-gradient-to-r from-blue-50 to-purple-50"
      >
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">🎯 Results That Matter</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Transform Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Client Relationships
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of creators and agencies who have revolutionized their client collaboration with
                ClientAlign.
              </p>

              <div className="benefits-list space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-gray-600">Creative Director</div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  "ClientAlign has completely transformed how we work with our clients. The transparency and goal
                  alignment features have reduced our revision cycles by 60% and increased client satisfaction
                  dramatically."
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" ref={ctaRef} className="cta-section relative z-10 py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="cta-content max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:bg-blue-200">
              🚀 Ready to Get Started?
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Start Aligning Your Projects Today
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the revolution in client-creator collaboration. Start your free trial and experience the difference
              ClientAlign makes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-12 py-4 text-lg border-gray-300 hover:border-blue-400 hover:text-blue-600"
              >
                Schedule Demo
              </Button>
            </div>

            <p className="text-gray-500">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CA</span>
                </div>
                <span className="font-bold text-xl">ClientAlign</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The multi-tenant collaboration platform that bridges the gap between clients and creators through
                transparent, goal-driven project management.
              </p>
              <div className="flex space-x-4">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400 text-sm">Enterprise-grade security</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} ClientAlign. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
