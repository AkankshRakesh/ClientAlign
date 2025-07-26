"use server"

import { createServerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const { supabase } = await createServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign-in error:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/projects")
}

export async function signUp(formData: FormData) {
  const origin = (await headers()).get("origin")
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string // Optional: for profile
  const { supabase } = await createServerClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, // Pass full_name to user metadata
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Sign-up error:", error.message)
    return { success: false, message: error.message }
  }

  return {
    success: true,
    message: "Check your email to confirm your account!",
  }
}

export async function signOut() {
  const { supabase } = await createServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Sign-out error:", error.message)
  }

  redirect("/")
}

export async function signInWithOAuth(formData: FormData) {
  const origin = (await headers()).get("origin")
  const provider = formData.get("provider") as "google" | "github" // Cast to known providers
  const { supabase } = await createServerClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error(`OAuth sign-in error with ${provider}:`, error.message)
    // For form actions, we need to redirect instead of returning
    redirect("/login?error=oauth_error")
  }

  // Supabase will redirect the user to the OAuth provider, so we redirect to the URL provided by Supabase.
  redirect(data.url!)
}
