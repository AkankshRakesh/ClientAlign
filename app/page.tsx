"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 to dark:to-pink-800 rounded-lg w-96 mb-4 animate-shimmer"></div>
          <div className="h-6 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 rounded-lg w-80 mb-8 animate-shimmer"></div>
          <div className="h-10 bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-800 dark:to-emerald-800 rounded-lg w-32 animate-shimmer"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] text-center relative px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-orange-400/15 to-red-400/15 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-in fade-in-50 slide-in-from-bottom-10 duration-1000">
          Welcome to ClientAlign
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 delay-300">
          Enable seamless, transparent, and goal-driven collaboration between
          clients and creators.
        </p>
      </div>

      {user ? (
        // Show authenticated user content
        <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 delay-600">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
            <p className="text-muted-foreground mb-4">
              Welcome back,{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {user.user_metadata?.full_name ||
                  user.email?.split("@")[0] ||
                  "User"}
              </span>
              !
            </p>
            <div className="flex gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/projects">View Projects</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20 transition-all duration-300"
              >
                <Link href="/projects">Create New Project</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Show unauthenticated user content
        <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 delay-600">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
            <p className="text-muted-foreground mb-4">
              Get started with your collaboration journey today.
            </p>
            <div className="flex gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
