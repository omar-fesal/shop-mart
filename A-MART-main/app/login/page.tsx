import { Suspense } from "react";
import LoginForm from "@/components/LoginForm/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
