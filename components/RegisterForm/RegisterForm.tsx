"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

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
import Link from "next/link"
import toast from "react-hot-toast"

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rePassword: z.string().min(6, "Password confirmation is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
})

type FormData = z.infer<typeof formSchema>

export default function RegisterForm() {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  })

  const [registerError, setRegisterError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const onSubmit = async (data: FormData) => {
    setRegisterError(null)
    setIsLoading(true)

    try {
      const response = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            rePassword: data.rePassword,
            phone: data.phone,
          }),
        }
      )

      const result = await response.json()

      if (response.ok) {
        toast.success("Account created successfully! Please login.")
        router.push("/login")
      } else {
        setRegisterError(result.message || "Registration failed")
        toast.error(result.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setRegisterError("An unexpected error occurred. Please try again.")
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full glass-card border border-border/30 shadow-xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Create Account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input {...field} type="text" className="rounded-xl" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input {...field} type="tel" className="rounded-xl" />
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

            <Controller
              name="rePassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input {...field} type="password" className="rounded-xl" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {registerError && (
            <p className="text-sm text-destructive mt-3 bg-destructive/10 rounded-lg p-2.5">{registerError}</p>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button
          disabled={isLoading}
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full gradient-primary text-white hover:opacity-90 rounded-xl transition-all shadow-lg shadow-[oklch(0.38_0.18_270)]/15"
        >
          {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
          Create Account
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-[oklch(0.38_0.18_270)] hover:underline font-medium">
            Login here
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}