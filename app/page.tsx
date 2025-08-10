"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-6 py-12">
        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="h-16 bg-gradient-to-r from-purple-200/80 to-pink-200/80 dark:from-purple-800/60 dark:to-pink-800/60 rounded-2xl animate-shimmer"></div>
            <div className="h-8 bg-gradient-to-r from-blue-200/80 to-cyan-200/80 dark:from-blue-800/60 dark:to-cyan-800/60 rounded-xl animate-shimmer delay-300"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 w-36 bg-gradient-to-r from-green-200/80 to-emerald-200/80 dark:from-green-800/60 dark:to-emerald-800/60 rounded-xl animate-shimmer delay-500"></div>
            <div className="h-12 w-36 bg-gradient-to-r from-orange-200/80 to-red-200/80 dark:from-orange-800/60 dark:to-red-800/60 rounded-xl animate-shimmer delay-700"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center relative px-6 py-12">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-24 left-16 w-48 h-48 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-16 right-8 w-36 h-36 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        {/* Additional subtle elements */}
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-violet-400/10 to-indigo-400/10 rounded-full blur-lg animate-pulse delay-3000"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-lg animate-pulse delay-1500"></div>
      </div>

      {/* Main content with improved spacing */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 leading-normal pb-2">
            Welcome to ClientAlign
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 delay-300 font-light">
              Enable seamless, transparent, and goal-driven collaboration between
              clients and creators.
            </p>
          </div>
        </div>
      </div>

      {user ? (
        // Show authenticated user content
        <div className="mt-12 animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 delay-600">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-lg border border-purple-200/60 dark:border-purple-800/60 shadow-2xl shadow-purple-500/10 dark:shadow-purple-900/20 max-w-2xl mx-auto">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground">
                  Welcome back,
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {user.user_metadata?.full_name ||
                    user.email?.split("@")[0] ||
                    "User"}!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  <Link href="/projects">View Projects</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 px-8 py-3 text-lg font-semibold rounded-xl backdrop-blur-sm"
                >
                  <Link href="/projects">Create New Project</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Show unauthenticated user content
        <div className="mt-12 animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 delay-600">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/90 to-cyan-50/90 dark:from-blue-900/30 dark:to-cyan-900/30 backdrop-blur-lg border border-blue-200/60 dark:border-blue-800/60 shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 max-w-2xl mx-auto">
            <div className="text-center space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Get started with your collaboration journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 px-8 py-3 text-lg font-semibold rounded-xl backdrop-blur-sm"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
