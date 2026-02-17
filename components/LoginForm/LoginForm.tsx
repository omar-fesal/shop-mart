"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
})

type FormData = z.infer<typeof formSchema>

export default function LoginForm() {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("callbackUrl") || "/"

  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const onSubmit = async (data: FormData) => {
    setLoginError(null)
    setIsLoading(true)

    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: redirectUrl ? redirectUrl : "/",
        redirect: true,

      })

      console.log("signIn response:", response)

      if (response?.error) {
        setLoginError("Invalid email or password")
        form.setError("password", { message: "Invalid email or password" })
      } else if (response?.ok) {
        router.push("/products")
      }
    } catch (error) {
      setLoginError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full glass-card border border-border/30 shadow-xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to login.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} type="email" className="rounded-xl" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input {...field} type="password" className="rounded-xl" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-between items-center mt-3">
            <Link href="#" className="text-sm text-[oklch(0.38_0.18_270)] hover:underline font-medium">
              Change Password
            </Link>
            <Link href="#" className="text-sm text-[oklch(0.38_0.18_270)] hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>

        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button disabled={isLoading} type="submit" onClick={form.handleSubmit(onSubmit)} className="w-full gradient-primary text-white hover:opacity-90 rounded-xl transition-all shadow-lg shadow-[oklch(0.38_0.18_270)]/15">
          {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
          Login
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <a href="/register" className="text-[oklch(0.38_0.18_270)] hover:underline cursor-pointer font-medium">
            Create one here
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}