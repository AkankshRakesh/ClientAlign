import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientAuthButtons } from "@/components/client-auth-buttons"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClientAlign",
  description: "Multi-tenant collaboration platform for clients and creators.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-gradient-to-br from-white/30 via-purple-50/20 to-pink-50/20 dark:from-gray-900/30 dark:via-purple-900/10 dark:to-pink-900/10">
              <main className="flex flex-col flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-gradient-to-r from-white/70 to-purple-50/40 dark:from-gray-900/70 dark:to-purple-900/30 backdrop-blur-md border border-purple-200/40 dark:border-purple-800/40 shadow-sm">
                  <SidebarTrigger className="text-purple-600 dark:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-300" />
                  <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <ClientAuthButtons />
                  </div>
                </div>
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
