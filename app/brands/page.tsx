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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Brands</h1>
        <p className="text-muted-foreground mt-2">Explore our collection of trusted brands</p>
      </div>

      {brands.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">No brands available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link href={`/brands/${brand._id}`} key={brand._id}>
              <Card className="overflow-hidden border border-border/50 cursor-pointer group card-hover">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 text-center border-t border-border/30">
                    <h3 className="font-semibold text-base group-hover:text-[oklch(0.38_0.18_270)] transition-colors">{brand.name}</h3>
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