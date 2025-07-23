"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  Eye, 
  EyeOff,
  Mail,
  Lock,
  Github,
  Chrome, 
  Shield,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";   

export default function SignInPage() { 
  const [showPassword, setShowPassword] = useState(false); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });  
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields!");
      return;
    }

    setIsLoading(true);
    const loginData = {
      email: formData.email,
      password: formData.password,
    };
    console.log("Logging in with data:", loginData);

    try {
      // Prepare data for API endpoint
      // Simulate API call - replace with actual endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password");
      }

      const result = await response.json();
      console.log("Signed in successfully:", result);

      // Store token if provided
      if (result.token) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userName", result.name || "");
        localStorage.setItem("userEmail", result.email || "");
      }

      // Redirect to dashboard
      // window.location.href = "/dashboard"
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl"></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="h-12 w-12 rotate-12 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 opacity-20 shadow-lg"></div>
        </div>
        <div className="absolute right-20 bottom-20 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-30 shadow-md"></div>
        </div>
        <div className="absolute top-1/3 right-16">
          <div className="h-6 w-6 rotate-45 animate-spin rounded-lg bg-gradient-to-br from-cyan-400 to-blue-400 opacity-25 shadow-sm"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 flex h-16 items-center border-b border-gray-200/50 bg-white/80 px-4 backdrop-blur-sm lg:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <span className="text-sm font-bold text-white">CA</span>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              ClientAlign
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Badge */}
          <div className="mb-8 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              👋 Welcome Back
            </Badge>
            <h1 className="mb-2 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-3xl font-bold text-transparent">
              Sign In to ClientAlign
            </h1>
            <p className="text-gray-600">
              Continue your journey to better client collaboration
            </p>
          </div>

          <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-center text-2xl font-semibold text-gray-900">
                Welcome back
              </CardTitle>
              <p className="text-center text-gray-600">
                Enter your credentials to access your account
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href={`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/github`}
                >
                  <Button variant="outline" className="w-full">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </Link>
                <Link
                  href={`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/google`}
                >
                  <Button variant="outline" className="w-full">
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pr-10 pl-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
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
                  <Link
                    href="/get-started"
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Get started for free
                  </Link>
                </p>
              </div>

              {/* Security Notice */}
              <div className="flex items-center justify-center space-x-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                <Shield className="h-4 w-4" />
                <span>
                  Your data is protected with enterprise-grade security
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
