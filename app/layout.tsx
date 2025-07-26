import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientAuthButtons } from "@/components/client-auth-buttons"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClientAlign",
  description: "Multi-tenant collaboration platform for clients and creators.",
    generator: 'v0.dev'
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
            <SidebarInset>
              <main className="flex flex-col flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 p-2 rounded-lg bg-gradient-to-r from-white/50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-purple-200/30 dark:border-purple-800/30">
                  <SidebarTrigger className="text-purple-600 dark:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/30" />
                  <div className="flex items-center gap-2">
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
