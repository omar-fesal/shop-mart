import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/profile', '/cart'];
const authRoutes = ['/login', '/register'];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/v1')) {
    const apiUrl = `https://ecommerce.routemisr.com${pathname}${req.nextUrl.search}`;
    
    const headers = new Headers(req.headers);
    headers.delete('host'); 
    
    return NextResponse.rewrite(apiUrl, {
      request: {
        headers,
      },
    });
  }

  if (protectedRoutes.includes(pathname)) {
    const token = await getToken({ req });
    
    if (!token) {
      const redirectURL = new URL('/login', req.url);
      redirectURL.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectURL);
    }
  }

  if (authRoutes.includes(pathname)) {
    const token = await getToken({ req });
    
    if (token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/cart/:path*',
    '/login',
    '/register',
    '/api/v1/:path*', 
  ],
};