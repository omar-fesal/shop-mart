"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserIcon, ShoppingCartIcon, Heart } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    const updateWishlistCount = () => {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setWishlistCount(localWishlist.length)
    }

    updateWishlistCount() 
    window.addEventListener("wishlistUpdated", updateWishlistCount)
    return () => window.removeEventListener("wishlistUpdated", updateWishlistCount)
  }, [])

  useEffect(() => {
    if (!session?.accessToken) return

    const fetchCartCount = async () => {
      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
          headers: { token: session.accessToken },
          cache: "no-store",
        })

        if (res.ok) {
          const data = await res.json()
          setCartCount(data.numOfCartItems || 0)
        }
      } catch (error) {
        console.log("Cart API unavailable")
      }
    }

    fetchCartCount()
  }, [session?.accessToken]) 

  return (
    <nav className="sticky top-0 z-50 bg-white p-2 border-b shadow-sm">
      <div className="container mx-auto p-2 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h2 className="text-xl font-bold">
          <Link href="/">A-Mart</Link>
        </h2>

        <div className="flex-1 flex justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/products">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/brands">Brands</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/categories">Categories</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/wishlist"
            className="relative flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Heart className="h-6 w-6 text-black" />
            {wishlistCount > 0 && (
              <span
                suppressHydrationWarning
                className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ShoppingCartIcon className="h-6 w-6 text-black" />
            {cartCount > 0 && (
              <span
                suppressHydrationWarning
                className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              suppressHydrationWarning
              className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <UserIcon className="h-6 w-6 text-black cursor-pointer" />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                {session?.user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/allorders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Signup</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}