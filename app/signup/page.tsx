import { AuthForm } from "@/components/auth-form"
import { signUp } from "@/app/auth/actions"

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        {/* Additional subtle elements */}
        <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-gradient-to-br from-violet-400/10 to-indigo-400/10 rounded-full blur-lg animate-pulse delay-3000"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-gradient-to-br from-white/90 via-green-50/80 to-blue-50/80 dark:from-gray-900/90 dark:via-green-900/20 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl p-8 border border-green-200/50 dark:border-green-800/30 shadow-2xl shadow-green-500/10 dark:shadow-green-900/20 animate-in fade-in-50 slide-in-from-bottom-10 duration-1000">
          <div className="mb-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-green-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal pb-1">
              Join ClientAlign
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Create your account and start collaborating today
            </p>
          </div>
          <AuthForm
            formAction={signUp}
            buttonText="Create an account"
            title=""
            description=""
            showFullName={true}
            redirectLink={{
              href: "/login",
              text: "Login",
              label: "Already have an account?",
            }}
            showSocialLogins={true}
          />
        </div>
      </div>
    </div>
  )
}
