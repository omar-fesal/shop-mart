'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function updateUserProfile(formData: {
  name: string
  email: string
  phone: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const response = await fetch(
      'https://ecommerce.routemisr.com/api/v1/users/updateMe/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: session.accessToken,
        },
        body: JSON.stringify(formData),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { success: false, message: data.message || 'Update failed' }
    }

    return { success: true, message: 'Profile updated successfully', data }
  } catch (error) {
    console.error('Update profile error:', error)
    return { success: false, message: 'Something went wrong' }
  }
}

export async function changePassword(formData: {
  currentPassword: string
  password: string
  rePassword: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const response = await fetch(
      'https://ecommerce.routemisr.com/api/v1/users/changeMyPassword',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: session.accessToken,
        },
        body: JSON.stringify(formData),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { success: false, message: data.message || 'Password change failed' }
    }

    return { success: true, message: 'Password changed successfully', data }
  } catch (error) {
    console.error('Change password error:', error)
    return { success: false, message: 'Something went wrong' }
  }
}