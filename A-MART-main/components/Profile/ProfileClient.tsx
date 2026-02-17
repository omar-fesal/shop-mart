'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field, FieldGroup } from '@/components/ui/field'
import { User, Lock, Mail, Phone, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateUserProfile, changePassword } from '@/lib/actions/profile-actions'
import { useRouter } from 'next/navigation'

interface UserData {
  name: string
  email: string
  phone?: string
}

export default function ProfileClient({ userData }: { userData: UserData | null }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    password: '',
    rePassword: '',
  })

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profileData.name || !profileData.email) {
      toast.error('Please fill all required fields')
      return
    }

    setIsLoading(true)

    try {
      const result = await updateUserProfile(profileData)

      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordData.currentPassword || !passwordData.password || !passwordData.rePassword) {
      toast.error('Please fill all fields')
      return
    }

    if (passwordData.password !== passwordData.rePassword) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const result = await changePassword(passwordData)

      if (result.success) {
        toast.success(result.message)
        setPasswordData({
          currentPassword: '',
          password: '',
          rePassword: '',
        })
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and security settings
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'profile'
              ? 'text-black'
              : 'text-muted-foreground hover:text-black'
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Information
          </div>
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'password'
              ? 'text-black'
              : 'text-muted-foreground hover:text-black'
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </div>
          {activeTab === 'password' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-card rounded-xl border p-6">
          <form onSubmit={handleUpdateProfile}>
            <FieldGroup>
              <Field>
                <Label htmlFor="name">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </div>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </div>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01234567890"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="bg-card rounded-xl border p-6">
          <form onSubmit={handleChangePassword}>
            <FieldGroup>
              <Field>
                <Label htmlFor="currentPassword">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Current Password
                  </div>
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, password: e.target.value })
                  }
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.rePassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      rePassword: e.target.value,
                    })
                  }
                  required
                />
              </Field>
            </FieldGroup>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                Update Password
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}