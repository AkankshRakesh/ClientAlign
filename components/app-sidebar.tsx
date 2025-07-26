"use client";

import { SidebarGroupAction } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import {
  Calendar,
  Home,
  Inbox,
  LayoutDashboard,
  Plus,
  Search,
  User2,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LayoutDashboard className="size-4" />
                <span>Loading...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
    );
  }

  if (!user) {
    // Show minimal sidebar for unauthenticated users
    return (
      <Sidebar>
        <SidebarHeader className="border-b border-purple-200/50 dark:border-purple-800/30 bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/20">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-pink-100/50 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-300"
              >
                <Link href="/">
                  <div className="p-1 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm">
                    <LayoutDashboard className="size-3 text-white" />
                  </div>
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ClientAlign
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-purple-700 dark:text-purple-300 font-semibold text-xs uppercase tracking-wider">
              Get Started
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                  >
                    <Link href="/login">
                      <LogIn className="size-4 text-green-600 dark:text-green-400" />
                      <span>Sign In</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300"
                  >
                    <Link href="/signup">
                      <UserPlus className="size-4 text-blue-600 dark:text-blue-400" />
                      <span>Sign Up</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Show full sidebar for authenticated users
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-purple-200/50 dark:border-purple-800/30 bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-pink-100/50 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-300">
                  <div className="p-1 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm">
                    <LayoutDashboard className="size-3 text-white" />
                  </div>
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ClientAlign
                  </span>
                  <ChevronDown className="ml-auto size-4 text-purple-600 dark:text-purple-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-purple-200/50 dark:border-purple-800/30">
                <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30">
                  <span>My Workspace</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30">
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="bg-gradient-to-r from-purple-200/50 via-pink-200/50 to-blue-200/50 dark:from-purple-800/30 dark:via-pink-800/30 dark:to-blue-800/30" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-700 dark:text-purple-300 font-semibold text-xs uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300"
                >
                  <Link href="/">
                    <Home className="size-4 text-blue-600 dark:text-blue-400" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300"
                >
                  <Link href="/projects">
                    <LayoutDashboard className="size-4 text-purple-600 dark:text-purple-400" />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20 transition-all duration-300"
                >
                  <Link href="#">
                    <Inbox className="size-4 text-orange-600 dark:text-orange-400" />
                    <span>Inbox</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                >
                  <Link href="#">
                    <Calendar className="size-4 text-green-600 dark:text-green-400" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-blue-50/50 dark:hover:from-indigo-900/20 dark:hover:to-blue-900/20 transition-all duration-300"
                >
                  <Link href="#">
                    <Search className="size-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="bg-gradient-to-r from-purple-200/50 via-pink-200/50 to-blue-200/50 dark:from-purple-800/30 dark:via-pink-800/30 dark:to-blue-800/30" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-700 dark:text-purple-300 font-semibold text-xs uppercase tracking-wider">
            Projects
          </SidebarGroupLabel>
          <SidebarGroupAction asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-5 hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-pink-100/50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300"
            >
              <Plus className="size-4 text-purple-600 dark:text-purple-400" />
              <span className="sr-only">Add Project</span>
            </Button>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Placeholder for dynamic projects */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                >
                  <Link href="/projects/p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11">
                    <span className="size-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm" />
                    <span>Website Redesign</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                >
                  <Link href="/projects/p2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12">
                    <span className="size-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm" />
                    <span>Mobile App Dev</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-purple-200/50 dark:border-purple-800/30 bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-gradient-to-r hover:from-purple-100/50 hover:to-pink-100/50 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-300">
                  <div className="p-1 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm">
                    <User2 className="size-3 text-white" />
                  </div>
                  <span className="font-medium">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "User"}
                  </span>
                  <ChevronUp className="ml-auto size-4 text-purple-600 dark:text-purple-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-purple-200/50 dark:border-purple-800/30"
              >
                <DropdownMenuItem
                  asChild
                  className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30"
                >
                  <Link href="/projects">
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30">
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 dark:hover:from-red-900/30 dark:hover:to-pink-900/30"
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
