"use client";

import React, { startTransition, useEffect, useState } from "react";
import { Product } from "@/interfaces/productinterfacr";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Loader2, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { data: session } = useSession();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const localWishlist: string[] = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );

        if (localWishlist.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }

        const productPromises = localWishlist.map(async (id) => {
          try {
            const res = await fetch(
              `https://ecommerce.routemisr.com/api/v1/products/${id}`,
              { cache: "no-store" }
            );
            if (res.ok) {
              const data = await res.json();
              return data.data;
            }
          } catch (err) {
            console.error(`Error fetching product ${id}:`, err);
          }
          return null;
        });

        const products = await Promise.all(productPromises);
        setWishlistProducts(products.filter(Boolean) as Product[]);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    setRemovingId(productId);
    try {
      const localWishlist: string[] = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      const updated = localWishlist.filter((id) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success("Removed from wishlist");

      if (session?.accessToken) {
        fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
          method: "DELETE",
          headers: { token: session.accessToken },
        }).catch(() => { });
      }
    } finally {
      setRemovingId(null);
    }
  };

  const clearWishlist = () => {
    localStorage.setItem("wishlist", JSON.stringify([]));
    setWishlistProducts([]);
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.success("Wishlist cleared");
  };

  const addToCart = async (productId: string) => {
    if (!session?.accessToken) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }
    setAddingToCartId(productId);
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: session.accessToken,
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        toast.success("Added to cart!");
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error("Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setAddingToCartId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-[oklch(0.38_0.18_270)]" size={32} />
        <p className="text-muted-foreground mt-4">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Save your favorite items here for later
          </p>
          <Link href="/products">
            <Button size="lg" className="gradient-primary text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[oklch(0.38_0.18_270)]/20">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Button
          variant="outline"
          onClick={clearWishlist}
          className="text-muted-foreground hover:text-destructive rounded-xl"
        >
          Clear all
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <div
            key={product._id}
            className="bg-card border border-border/50 rounded-2xl overflow-hidden card-hover group"
          >
            <Link href={`/products/${product._id}`}>
              <div className="relative w-full aspect-square bg-secondary/20 overflow-hidden">
                <Image
                  src={product.imageCover}
                  alt={product.title}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            </Link>

            <div className="p-4 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.brand?.name || "No Brand"}
              </p>

              <Link href={`/products/${product._id}`}>
                <h3 className="font-semibold text-base line-clamp-2 hover:text-[oklch(0.38_0.18_270)] transition-colors leading-snug min-h-12">
                  {product.title}
                </h3>
              </Link>

              <div className="text-lg font-bold">EGP {product.price?.toFixed(2)}</div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => addToCart(product._id)}
                  disabled={addingToCartId === product._id}
                  className="flex-1 gradient-primary text-white py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {addingToCartId === product._id ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  disabled={removingId === product._id}
                  className="p-2.5 border border-border/50 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-destructive transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}