"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProductsResponse } from "@/interfaces/productinterfacr";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductSkeleton from "@/components/Skeletons/ProductSkeleton";
import AddToCart from "@/components/AddToCart/AddToCart";

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<ProductsResponse["data"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/products",
          { cache: "no-store" }
        );

        if (!res.ok) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const data: ProductsResponse = await res.json();
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating: number = 0) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.floor(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-200 fill-gray-200"
          }`}
      />
    ));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground mt-2">Discover our curated collection of premium products</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No products available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden flex flex-col bg-card border border-border/50 card-hover group"
            >
              <Link href={`/products/${product._id}`}>
                <div className="relative w-full bg-secondary/30 cursor-pointer overflow-hidden" style={{ paddingBottom: '100%' }}>
                  <Image
                    src={product.imageCover}
                    alt={product.title || "Product"}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
              </Link>

              <CardContent className="p-4 space-y-2 flex-1 flex flex-col">
                <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {product.brand?.name || "No Brand"}
                </CardDescription>

                <Link href={`/products/${product._id}`}>
                  <CardTitle className="text-base font-semibold line-clamp-2 hover:text-[oklch(0.38_0.18_270)] transition-colors cursor-pointer min-h-12 leading-snug">
                    {product.title}
                  </CardTitle>
                </Link>

                <CardDescription className="text-xs text-muted-foreground">
                  {product.category?.name || "No Category"}
                </CardDescription>

                <div className="flex items-center gap-1.5 pt-1">
                  <div className="flex">{renderStars(product.ratingsAverage)}</div>
                  <span className="text-xs text-muted-foreground">
                    ({product.ratingsQuantity || 0})
                  </span>
                </div>

                <div className="text-xl font-bold text-foreground mt-auto pt-2">
                  EGP {product.price.toFixed(2)}
                </div>
              </CardContent>

              <div className="px-4 pb-4">
                {session?.accessToken ? (
                  <AddToCart productId={product._id} />
                ) : (
                  <Link href="/login">
                    <button className="w-full gradient-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-[oklch(0.38_0.18_270)]/20 flex items-center justify-center gap-2 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add To Cart
                    </button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}