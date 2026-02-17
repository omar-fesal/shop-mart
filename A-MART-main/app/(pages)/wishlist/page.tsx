"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  brand?: { name: string };
  category?: { name: string };
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setIsLoading(true);

      const localWishlist: string[] = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      if (localWishlist.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      const results = await Promise.allSettled(
        localWishlist.map((id) =>
          fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
            cache: "no-store",
          }).then((res) => (res.ok ? res.json() : null))
        )
      );

      const fetched: Product[] = results
        .filter(
          (r): r is PromiseFulfilledResult<{ data: Product }> =>
            r.status === "fulfilled" && r.value?.data
        )
        .map((r) => r.value.data);

      setProducts(fetched);
      setIsLoading(false);
    };

    fetchWishlistProducts();
  }, []);

  const removeFromWishlist = (productId: string) => {
    const localWishlist: string[] = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    const updated = localWishlist.filter((id) => id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.success("Removed from wishlist");

    if (session?.accessToken) {
      fetch(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: { token: session.accessToken as string },
        }
      ).catch(() => {});
    }
  };

  const addToCart = async (productId: string) => {
    if (!session?.accessToken) {
      toast.error("Please login first");
      return;
    }

    setAddingToCart(productId);
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: session.accessToken as string,
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (res.ok) {
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAddingToCart(null);
    }
  };

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 fill-gray-300"
        }`}
      />
    ));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-gray-100 animate-pulse h-80"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-3xl font-bold mb-3">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-8">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-black hover:bg-gray-800">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          My Wishlist{" "}
          <span className="text-gray-400 text-xl font-normal">
            ({products.length} items)
          </span>
        </h1>
        <button
          onClick={() => {
            localStorage.setItem("wishlist", "[]");
            setProducts([]);
            window.dispatchEvent(new Event("wishlistUpdated"));
            toast.success("Wishlist cleared");
          }}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors underline"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product._id}
            className="group overflow-hidden border hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden bg-gray-50">
                <Link href={`/products/${product._id}`}>
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    width={400}
                    height={300}
                    className="w-full h-56 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  {product.brand?.name || product.category?.name || ""}
                </p>

                <Link href={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 hover:underline">
                    {product.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-1">
                  {renderStars(product.ratingsAverage)}
                  <span className="text-xs text-gray-500 ml-1">
                    {product.ratingsAverage?.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-gray-900">
                    {product.price} EGP
                  </span>
                </div>

                <Button
                  onClick={() => addToCart(product._id)}
                  disabled={addingToCart === product._id}
                  className="w-full bg-black hover:bg-gray-800 text-white text-sm mt-2"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {addingToCart === product._id ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}