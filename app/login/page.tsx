import { AuthForm } from "@/components/auth-form";
import { signIn } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue your collaboration journey
            </p>
          </div>
          <AuthForm
            formAction={signIn}
            buttonText="Login"
            title="Login"
            description="Enter your email below to login to your account"
            redirectLink={{
              href: "/signup",
              text: "Sign up",
              label: "Don't have an account?",
            }}
            showSocialLogins={true} // Enable social logins
          />
        </div>
      </div>
    </div>
  );
}
