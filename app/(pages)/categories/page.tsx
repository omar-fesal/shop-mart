"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/app/(pages)/products/loading";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface CategoriesResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  data: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/categories", {
          cache: "no-store",
        });

        if (res.ok) {
          const data: CategoriesResponse = await res.json();
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-2">Browse products by category</p>
      </div>

      {categories.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link href={`/categories/${category._id}`} key={category._id}>
              <Card className="overflow-hidden border border-border/50 cursor-pointer group card-hover">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-4 text-center border-t border-border/30">
                    <h3 className="font-semibold text-base group-hover:text-[oklch(0.38_0.18_270)] transition-colors">{category.name}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}