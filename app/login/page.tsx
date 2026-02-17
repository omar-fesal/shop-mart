import { Suspense } from "react";
import LoginForm from "@/components/LoginForm/LoginForm";

export default function Login() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: 'oklch(0.78 0.10 270 / 0.3)' }} />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full blur-3xl opacity-25" style={{ background: 'oklch(0.78 0.12 75 / 0.3)' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your ShopMart account</p>
        </div>
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
