import { AuthForm } from "@/components/auth-form"
import { signIn } from "@/app/auth/actions"

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-indigo-400/20 to-violet-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        {/* Additional subtle elements */}
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-lg animate-pulse delay-3000"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-gradient-to-br from-white/90 via-blue-50/80 to-purple-50/80 dark:from-gray-900/90 dark:via-blue-900/20 dark:to-purple-900/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-200/50 dark:border-blue-800/30 shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 animate-in fade-in-50 slide-in-from-bottom-10 duration-1000">
          <div className="mb-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-normal pb-1">
              Welcome Back
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Sign in to continue your collaboration journey
            </p>
          </div>
          <AuthForm
            formAction={signIn}
            buttonText="Sign In"
            title=""
            description=""
            redirectLink={{
              href: "/signup",
              text: "Sign up",
              label: "Don't have an account?",
            }}
            showSocialLogins={true}
          />
        </div>
        
        {/* Additional info section */}
        <div className="mt-6 text-center text-sm text-muted-foreground animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 delay-300">
          <p>Secure login with industry-standard encryption</p>
        </div>
      </div>
    </div>
  )
}
