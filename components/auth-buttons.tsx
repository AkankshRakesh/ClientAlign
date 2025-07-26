import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import Link from "next/link";
import { User, LogIn, UserPlus, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export async function AuthButtons() {
  let session = null;
  let user = null;

  try {
    const { supabase } = await createServerClient();
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    session = currentSession;
    user = session?.user;
  } catch (error) {
    console.error("Error fetching session:", error);
  }

  if (session && user) {
    // User is authenticated - show user menu
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-pink-100/50 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-300"
            >
              <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">
                {user.user_metadata?.full_name ||
                  user.email?.split("@")[0] ||
                  "User"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/20"
          >
            <DropdownMenuItem
              asChild
              className="hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-pink-100/50 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50"
            >
              <Link href="/projects" className="flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700" />
            <DropdownMenuItem
              asChild
              className="hover:bg-gradient-to-r hover:from-red-100/50 hover:to-pink-100/50 dark:hover:from-red-900/50 dark:hover:to-pink-900/50"
            >
              <form action={signOut} className="w-full">
                <button
                  type="submit"
                  className="flex items-center gap-2 w-full text-left"
                >
                  <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // User is not authenticated - show login/signup buttons
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="hover:bg-gradient-to-r hover:from-green-100/50 hover:to-blue-100/50 dark:hover:from-green-900/50 dark:hover:to-blue-900/50 transition-all duration-300"
      >
        <Link href="/login" className="flex items-center gap-2">
          <LogIn className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
      </Button>
      <Button
        size="sm"
        asChild
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Link href="/signup" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Up</span>
        </Link>
      </Button>
    </div>
  );
}
