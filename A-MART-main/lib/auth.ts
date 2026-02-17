import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        try {
          console.log('🔄 Attempting login for:', credentials.email);
          
          const response = await fetch(
            "https://ecommerce.routemisr.com/api/v1/auth/signin",
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          console.log('📡 Response status:', response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.log('❌ Login failed:', errorData);
            return null;
          }

          const payload = await response.json();
          console.log('✅ Login successful. Token:', payload.token);

          return {
            id: payload.user.email,
            name: payload.user.name,
            email: payload.user.email,
            accessToken: payload.token,
          };
        } catch (error) {
          console.error('❌ Login error:', error);
          return null;
        }
      },
    }),
  ],

  pages: { signIn: "/login" },

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('💾 JWT Callback - Saving token from user:', user.accessToken);
        token.accessToken = user.accessToken;
      }
      console.log('💾 JWT Callback - Current token:', token.accessToken);
      return token;
    },

    async session({ session, token }) {
      console.log('📤 Session Callback - Token from JWT:', token.accessToken);
      session.accessToken = token.accessToken;
      console.log('📤 Session Callback - Final session:', JSON.stringify(session));
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}