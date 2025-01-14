'use client'

import { useState } from "react"
import { SignIn } from "./auth/sign-in"
import { SignUp } from "./auth/sign-up"
import { Button } from "./ui/button"

export function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant={isSignIn ? "default" : "outline"}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </Button>
          <Button
            variant={!isSignIn ? "default" : "outline"}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </Button>
        </div>
        {isSignIn ? <SignIn /> : <SignUp />}
      </div>
    </div>
  )
}