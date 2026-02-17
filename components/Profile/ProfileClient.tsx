"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Loader2, User, Lock } from "lucide-react"
import toast from "react-hot-toast"
import { updateUserProfile, changePassword } from "@/lib/actions/profile-actions"

interface ProfileClientProps {
  user: {
    name?: string
    email?: string
    phone?: string
    role?: string
  }
  token: string
}

export default function ProfileClient({ user, token }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")

  // Profile state
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [profileLoading, setProfileLoading] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)

    try {
      const result = await updateUserProfile({ name, email, phone })

      if (result.success) {
        toast.success("Profile updated successfully!")
      } else {
        toast.error(result.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== rePassword) {
      toast.error("Passwords don't match")
      return
    }
    setPasswordLoading(true)

    try {
      const result = await changePassword(
        { currentPassword, password, rePassword }
      )

      if (result.success) {
        toast.success("Password updated successfully!")
        setCurrentPassword("")
        setPassword("")
        setRePassword("")
      } else {
        toast.error(result.message || "Failed to change password")
      }
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setPasswordLoading(false)
    }
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "password" as const, label: "Password", icon: Lock },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and security</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card className="glass-card border border-border/30 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl"
                  />
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="rounded-xl"
                  />
                </Field>

                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    className="rounded-xl"
                  />
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                disabled={profileLoading}
                className="mt-6 gradient-primary text-white hover:opacity-90 rounded-xl w-full transition-all shadow-lg shadow-[oklch(0.38_0.18_270)]/15"
              >
                {profileLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <Card className="glass-card border border-border/30 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Current Password</FieldLabel>
                  <Input
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type="password"
                    className="rounded-xl"
                  />
                </Field>

                <Field>
                  <FieldLabel>New Password</FieldLabel>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="rounded-xl"
                  />
                </Field>

                <Field>
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <Input
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    type="password"
                    className="rounded-xl"
                  />
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                disabled={passwordLoading}
                className="mt-6 gradient-primary text-white hover:opacity-90 rounded-xl w-full transition-all shadow-lg shadow-[oklch(0.38_0.18_270)]/15"
              >
                {passwordLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}