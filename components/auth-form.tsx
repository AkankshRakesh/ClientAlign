"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signInWithOAuth } from "@/app/auth/actions"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

interface AuthFormProps {
  formAction: (
    prevState: any,
    formData: FormData
  ) => Promise<{ success: boolean; message: string } | undefined>
  buttonText: string
  title: string
  description: string
  showFullName?: boolean
  redirectLink?: { href: string; text: string; label: string }
  showSocialLogins?: boolean // New prop for social logins
}

export function AuthForm({
  formAction,
  buttonText,
  title,
  description,
  showFullName = false,
  redirectLink,
  showSocialLogins = false, // Default to false
}: AuthFormProps) {
  const [state, action, isPending] = useActionState(formAction, undefined)

  return (
    <div className="w-full">
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-center mb-2">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-center">{description}</p>
          )}
        </div>
      )}
      
      <form action={action} className="grid gap-5">
        {showFullName && (
          <div className="grid gap-2">
            <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="John Doe"
              required
              className="h-11 rounded-xl border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 transition-all duration-200"
            />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            className="h-11 rounded-xl border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required
            className="h-11 rounded-xl border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 mt-2" 
          disabled={isPending}
        >
          {isPending ? "Processing..." : buttonText}
        </Button>
        {state?.message && (
          <div
            className={`text-center text-sm p-3 rounded-xl ${
              state.success 
                ? "text-green-700 bg-green-50/80 dark:text-green-400 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50" 
                : "text-red-700 bg-red-50/80 dark:text-red-400 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50"
            }`}
          >
            {state.message}
          </div>
        )}
      </form>

      {showSocialLogins && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200/60 dark:border-gray-700/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 px-4 text-muted-foreground font-medium">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <form action={signInWithOAuth}>
              <input type="hidden" name="provider" value="google" />
              <Button 
                variant="outline" 
                className="w-full h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 rounded-xl font-medium"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Google
              </Button>
            </form>
            <form action={signInWithOAuth}>
              <input type="hidden" name="provider" value="github" />
              <Button 
                variant="outline" 
                className="w-full h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 rounded-xl font-medium"
              >
                <FaGithub className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </form>
          </div>
        </>
      )}

      {redirectLink && (
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">{redirectLink.label}</span>{" "}
          <Link 
            href={redirectLink.href} 
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 hover:underline-offset-2 transition-all duration-200"
          >
            {redirectLink.text}
          </Link>
        </div>
      )}
    </div>
  )
}
