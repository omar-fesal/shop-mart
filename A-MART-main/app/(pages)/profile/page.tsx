// app/(pages)/profile/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProfileClient from '@/components/Profile/ProfileClient'

async function getUserData(token: string) {
  try {
    const response = await fetch(
      'https://ecommerce.routemisr.com/api/v1/users/getMe',
      {
        headers: { token },
        cache: 'no-store',
      }
    )

    if (!response.ok) return null
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect('/login')
  }

  const userData = await getUserData(session.accessToken)

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileClient userData={userData} />
    </div>
  )
}