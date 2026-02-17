  import NextAuth, { AuthOptions } from "next-auth"
  import CredentialsProvider from "next-auth/providers/credentials"

  export interface UserInterface {
    name: string
    email: string
    role: string
  }

  export interface SuccessLogin {
    message: string
    user: UserInterface
    token: string
  }

  export const authOptions: AuthOptions = {
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

            if (!response.ok) return null;

            const payload: SuccessLogin = await response.json();
            console.log('✅ Login successful. Token:', payload.token);

            return {
              id: payload.user.email,
              name: payload.user.name,
              email: payload.user.email,
              accessToken: payload.token, // ✅ غيّرت من token لـ accessToken
            };
          } catch (error) {
            console.error('❌ Login error:', error);
            return null;
          }
        },
      }),
    ],

    pages: {
      signIn: "/login",
      error: "/login",
    },

    session: {
      strategy: "jwt",
    },

    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          console.log('💾 Saving token to JWT:', user.accessToken);
          token.accessToken = user.accessToken; 
        }
        console.log('🔑 Current JWT token:', token.accessToken);
        return token;
      },
      
      async session({ session, token }) {
        console.log('📤 Adding token to session:', token.accessToken);
        session.accessToken = token.accessToken as string; // ✅ الصح
        console.log('📤 Final session:', session);
        return session;
      },
    },

    secret: process.env.NEXTAUTH_SECRET,
  }

  const handler = NextAuth(authOptions)

  export { handler as GET, handler as POST }