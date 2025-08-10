"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TermsModalProps {
  children: React.ReactNode
}

export function TermsModal({ children }: TermsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-50/90 dark:from-gray-900/95 dark:via-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl border border-purple-200/50 dark:border-purple-800/50 rounded-2xl shadow-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl">🎭</span>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Terms & Conditions
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground leading-relaxed space-y-3">
            <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">
              You agree to star this repository on GitHub! ⭐
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              Just kidding, there are no terms! 😄
            </p>
            <p className="leading-relaxed">
              We believe in keeping things simple and fun. Your privacy is important to us, 
              and we'll never do anything shady with your data. Welcome to ClientAlign!
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button 
            onClick={() => setIsOpen(false)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Got it! 😊
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
