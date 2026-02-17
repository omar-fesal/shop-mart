import RegisterForm from "@/components/RegisterForm/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <RegisterForm />
    </div>
  )
}