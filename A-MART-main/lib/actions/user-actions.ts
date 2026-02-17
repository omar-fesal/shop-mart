'use server'

import { cookies } from 'next/headers'

export async function saveUserId(userId: string) {
  (await cookies()).set('userId', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, 
  })
}