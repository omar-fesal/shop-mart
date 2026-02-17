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
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 fill-gray-300"
        }`}
      />
    ));

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col bg-white"
            >
              <Link href={`/products/${product._id}`}>
                <div className="relative w-full bg-white cursor-pointer hover:bg-gray-50 transition-colors" style={{ paddingBottom: '100%' }}>
                  <Image
                    src={product.imageCover}
                    alt={product.title || "Product"}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
              </Link>

              <CardContent className="p-4 space-y-2 flex-1 flex flex-col">
                <CardDescription className="text-sm text-gray-500">
                  {product.brand?.name || "No Brand"}
                </CardDescription>

                <Link href={`/products/${product._id}`}>
                  <CardTitle className="text-lg font-bold line-clamp-2 hover:text-gray-600 transition-colors cursor-pointer min-h-14">
                    {product.title}
                  </CardTitle>
                </Link>

                <CardDescription className="text-sm text-gray-500">
                  {product.category?.name || "No Category"}
                </CardDescription>

                <div className="flex items-center gap-1 pt-2">
                  <div className="flex">{renderStars(product.ratingsAverage)}</div>
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.ratingsQuantity || 0})
                  </span>
                </div>

                <div className="text-xl font-bold text-gray-900 mt-auto pt-2">
                  EGP {product.price.toFixed(2)}
                </div>
              </CardContent>

              <div className="px-4 pb-4">
                {session?.accessToken ? (
                  <AddToCart productId={product._id} />
                ) : (
                  <Link href="/login">
                    <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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