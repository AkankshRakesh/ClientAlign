"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
  User,
  Github,
  Chrome,
  Shield,
  ArrowLeft,
  CheckCircle,
  Users,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function GetStartedPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "creator" as "creator" | "client",
  });
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const router = useRouter();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token); // Store the JWT
      localStorage.setItem("userName", name || ""); // Store the user's name
      localStorage.setItem("userEmail", email || ""); // Store the user's email
      router.push("/"); // Redirect to a protected route
    }
  }, [token, router, name, email]);
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleRoleChange = (role: "creator" | "client") => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions!");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API endpoint
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      // Simulate API call - replace with actual endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      const result = await response.json();
      console.log("Account created successfully:", result);

      // Redirect to dashboard or success page
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

  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Cancel anytime",
    "Full feature access",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Elements */}

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
        <div className="w-full max-w-4xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
                  🚀 Start Your Journey
                </Badge>
                <h1 className="mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
                  Get Started with ClientAlign
                </h1>
                <p className="text-xl leading-relaxed text-gray-600">
                  Join thousands of creators and agencies who have
                  revolutionized their client collaboration.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <div className="mb-3 flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    Enterprise Security
                  </span>
                </div>
                <p className="text-gray-600">
                  Your data is protected with bank-level encryption and security
                  protocols trusted by Fortune 500 companies.
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-center text-2xl font-semibold text-gray-900">
                    Create your account
                  </CardTitle>
                  <p className="text-center text-gray-600">
                    Start your free trial today
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Social Sign Up Buttons */}
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

                  {/* Sign Up Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

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

                    {/* Role Selection */}
                    <div className="space-y-3">
                      <Label>I am a...</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleRoleChange("creator")}
                          className={`rounded-lg border-2 p-4 transition-all duration-200 ${
                            formData.role === "creator"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <Palette className="h-6 w-6" />
                            <span className="font-medium">Creator</span>
                            <span className="text-center text-xs">
                              Designer, Developer, Agency
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleChange("client")}
                          className={`rounded-lg border-2 p-4 transition-all duration-200 ${
                            formData.role === "client"
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <Users className="h-6 w-6" />
                            <span className="font-medium">Client</span>
                            <span className="text-center text-xs">
                              Business, Startup, Individual
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
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
                      <p className="text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                          setAcceptTerms(checked as boolean)
                        }
                        className="mt-1"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm leading-relaxed text-gray-600"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading || !acceptTerms}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <>
                          Start Free Trial
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Sign In Link */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/signin"
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
