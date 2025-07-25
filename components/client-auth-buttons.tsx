"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, LogIn, UserPlus, LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ClientAuthButtonsProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showLabels?: boolean
}

export function ClientAuthButtons({ 
  variant = "outline", 
  size = "sm", 
  showLabels = true 
}: ClientAuthButtonsProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    // User is authenticated - show user menu
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} size={size} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {showLabels && (
                <span className="hidden sm:inline">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/projects" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // User is not authenticated - show login/signup buttons
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size={size} asChild>
        <Link href="/login" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          {showLabels && <span className="hidden sm:inline">Sign In</span>}
        </Link>
      </Button>
      <Button size={size} asChild>
        <Link href="/signup" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          {showLabels && <span className="hidden sm:inline">Sign Up</span>}
        </Link>
      </Button>
    </div>
  )
}
