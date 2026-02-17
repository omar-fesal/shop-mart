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
import { UserIcon, ShoppingCartIcon, Heart, Menu, X } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount()
    }

    window.addEventListener("cartUpdates", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdates", handleCartUpdate)
    }
  }, [session?.accessToken])

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/brands", label: "Brands" },
    { href: "/categories", label: "Categories" },
  ]

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Shop<span className="text-gradient">Mart</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-secondary/60 group"
                      >
                        {link.label}
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 gradient-primary rounded-full transition-all duration-300 group-hover:w-6" />
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/wishlist"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-secondary/60 transition-all duration-200"
            >
              <Heart className="h-5 w-5 text-muted-foreground" />
              {wishlistCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute -top-0.5 -right-0.5 gradient-primary text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1 shadow-md animate-in zoom-in-50"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-secondary/60 transition-all duration-200"
            >
              <ShoppingCartIcon className="h-5 w-5 text-muted-foreground" />
              {cartCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute -top-0.5 -right-0.5 gradient-primary text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1 shadow-md animate-in zoom-in-50"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                suppressHydrationWarning
                className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-secondary/60 transition-all duration-200"
              >
                <UserIcon className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 rounded-xl shadow-lg border border-border/50 backdrop-blur-sm">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold px-3 py-2">My Account</DropdownMenuLabel>

                  {session?.user ? (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg mx-1 cursor-pointer">
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg mx-1 cursor-pointer">
                        <Link href="/allorders">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="rounded-lg mx-1 cursor-pointer text-destructive focus:text-destructive"
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg mx-1 cursor-pointer">
                        <Link href="/login">Login</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg mx-1 cursor-pointer">
                        <Link href="/register">Signup</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-secondary/60 transition-all duration-200 ml-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/30 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}