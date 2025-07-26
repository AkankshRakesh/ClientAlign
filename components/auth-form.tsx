"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { signInWithOAuth } from "@/app/auth/actions"; // Import the new action
import { FcGoogle } from "react-icons/fc"; // Import Google icon
import { FaGithub } from "react-icons/fa"; // Import GitHub icon

interface AuthFormProps {
  formAction: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ success: boolean; message: string } | undefined>;
  buttonText: string;
  title: string;
  description: string;
  showFullName?: boolean;
  redirectLink?: { href: string; text: string; label: string };
  showSocialLogins?: boolean; // New prop for social logins
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
  const [state, action, isPending] = useActionState(formAction, undefined);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          {showFullName && (
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Processing..." : buttonText}
          </Button>
          {state?.message && (
            <p
              className={`text-center text-sm ${state.success ? "text-green-500" : "text-red-500"}`}
            >
              {state.message}
            </p>
          )}
        </form>

        {showSocialLogins && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <form action={signInWithOAuth}>
                <input type="hidden" name="provider" value="google" />
                <Button variant="outline" className="w-full bg-transparent">
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </form>
              <form action={signInWithOAuth}>
                <input type="hidden" name="provider" value="github" />
                <Button variant="outline" className="w-full bg-transparent">
                  <FaGithub className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </form>
            </div>
          </>
        )}

        {redirectLink && (
          <div className="mt-4 text-center text-sm">
            {redirectLink.label}{" "}
            <Link href={redirectLink.href} className="underline">
              {redirectLink.text}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
