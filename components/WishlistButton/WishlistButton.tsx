"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface WishlistButtonProps {
  productId: string;
}
export default function WishlistButton({ productId }: WishlistButtonProps) {
  const { data: session } = useSession();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(localWishlist.includes(productId));
  }, [productId]);

  const toggleWishlist = async () => {
    if (!session?.accessToken) {
      toast.error("Please login first");
      return;
    }

    setIsLoading(true);
    const newState = !isInWishlist;

    try {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

      if (newState) {
        // Add to wishlist
        if (!localWishlist.includes(productId)) {
          localWishlist.push(productId);
        }
        localStorage.setItem('wishlist', JSON.stringify(localWishlist));
        setIsInWishlist(true);
        toast.success("Added to wishlist");

        window.dispatchEvent(new Event('wishlistUpdated'));

        fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: session.accessToken,
          },
          body: JSON.stringify({ productId }),
        }).catch(() => {
          console.log('API sync failed, using localStorage only');
        });
      } else {
        const filtered = localWishlist.filter((id: string) => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(filtered));
        setIsInWishlist(false);
        toast.success("Removed from wishlist");

        window.dispatchEvent(new Event('wishlistUpdated'));

        fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
          method: "DELETE",
          headers: { token: session.accessToken },
        }).catch(() => {
          console.log('API sync failed, using localStorage only');
        });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`p-3 border rounded-xl transition-all duration-200 ${isInWishlist
          ? "bg-red-50 border-red-200 hover:bg-red-100 shadow-sm shadow-red-100"
          : "border-border/50 hover:bg-secondary/60 hover:border-border"
        } disabled:opacity-40`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${isInWishlist ? "text-red-500 fill-red-500 scale-110" : "text-muted-foreground"
          }`}
      />
    </button>
  );
}