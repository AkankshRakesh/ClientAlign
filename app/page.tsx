import { Button } from "@/components/ui/button"
import { ClientAuthButtons } from "@/components/client-auth-buttons"
import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function HomePage() {
  let session = null
  let user = null

  try {
    const { supabase } = await createServerClient()
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    session = currentSession
    user = session?.user
  } catch (error) {
    console.error("Error fetching session:", error)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Welcome to ClientAlign</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        Enable seamless, transparent, and goal-driven collaboration between clients and creators.
      </p>
      
      {user ? (
        // Show authenticated user content
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-muted-foreground">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}!
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">Create New Project</Link>
            </Button>
          </div>
        </div>
      ) : (
        // Show unauthenticated user content
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-muted-foreground">
            Get started with your collaboration journey today.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
