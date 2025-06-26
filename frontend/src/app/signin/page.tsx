"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Eye, EyeOff, Mail, Lock, Github, Chrome, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields!")
      return
    }

    setIsLoading(true)
    const loginData = {
      email: formData.email,
      password: formData.password,
    }
    console.log("Logging in with data:", loginData)

    try {
      // Prepare data for API endpoint
      // Simulate API call - replace with actual endpoint
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Invalid email or password")
      }

      const result = await response.json()
      console.log("Signed in successfully:", result)

      // Store token if provided
      if (result.token) {
        localStorage.setItem("authToken", result.token)
      }

      // Redirect to dashboard
      // window.location.href = "/dashboard"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-20 rotate-12 shadow-lg"></div>
        </div>
        <div className="absolute bottom-20 right-20 animate-pulse">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-30 shadow-md"></div>
        </div>
        <div className="absolute top-1/3 right-16">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg opacity-25 rotate-45 shadow-sm animate-spin"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 px-4 lg:px-6 h-16 flex items-center backdrop-blur-sm bg-white/80 border-b border-gray-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ClientAlign
            </span>
          </Link>

          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Badge */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">👋 Welcome Back</Badge>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
              Sign In to ClientAlign
            </h1>
            <p className="text-gray-600">Continue your journey to better client collaboration</p>
          </div>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-semibold text-center text-gray-900">Welcome back</CardTitle>
              <p className="text-center text-gray-600">Enter your credentials to access your account</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="http://localhost:5000/api/auth/github">
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Don&#39;t have an account?{" "}
                  <Link href="/get-started" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Get started for free
                  </Link>
                </p>
              </div>

              {/* Security Notice */}
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                <Shield className="h-4 w-4" />
                <span>Your data is protected with enterprise-grade security</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
