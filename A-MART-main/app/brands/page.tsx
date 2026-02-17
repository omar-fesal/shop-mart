"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/app/(pages)/products/loading"; 

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface BrandsResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  data: Brand[];
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/brands", {
          cache: "no-store",
        });

        if (res.ok) {
          const data: BrandsResponse = await res.json();
          setBrands(data.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Brands</h1>

      {brands.length === 0 ? (
        <p className="text-gray-500 text-center">No brands available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link href={`/brands/${brand._id}`} key={brand._id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-square bg-white flex items-center justify-center">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 text-center border-t">
                    <h3 className="font-semibold text-lg">{brand.name}</h3>
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