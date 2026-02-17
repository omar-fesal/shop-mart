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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Categories</h1>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link href={`/categories/${category._id}`} key={category._id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-square bg-white flex items-center justify-center">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 text-center border-t">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
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