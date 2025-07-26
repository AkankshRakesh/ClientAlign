import { AuthForm } from "@/components/auth-form";
import { signUp } from "@/app/auth/actions";

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Join ClientAlign
            </h1>
            <p className="text-muted-foreground">
              Create your account and start collaborating today
            </p>
          </div>
          <AuthForm
            formAction={signUp}
            buttonText="Create an account"
            title="Sign Up"
            description="Enter your details below to create your account"
            showFullName={true}
            redirectLink={{
              href: "/login",
              text: "Login",
              label: "Already have an account?",
            }}
            showSocialLogins={true} // Enable social logins
          />
        </div>
      </div>
    </div>
  );
}
