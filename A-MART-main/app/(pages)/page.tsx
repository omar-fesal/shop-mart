"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default function Home() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("https://ecommerce.routemisr.com/api/v1/brands");
        const data = await response.json();
        
        if (data.data) {
          setBrands(data.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen relative bg-[#ffffff]">
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 lg:py-20">
            <div className="space-y-6 lg:space-y-10 relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-tight lg:leading-[1.1]">
                Find Brands<br />
                That Matches<br />
                Your Style
              </h1>

              <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                Browse through our diverse range of meticulously crafted garments,
                designed to bring out your individuality and cater to your sense of style.
              </p>

              <Link href="/products">
                <Button className="bg-black hover:bg-gray-800 text-white px-12 lg:px-16 py-4 lg:py-5 rounded-full text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl">
                  Shop Now
                </Button>
              </Link>

              <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-8 lg:pt-12">
  <div className="space-y-1">
    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
      <CountUp end={200} duration={2.5} />+
    </h3>
    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">International Brands</p>
  </div>
  
  <div className="space-y-1 border-l-2 border-gray-300 pl-4 lg:pl-8">
    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
      <CountUp end={2000} duration={2.5} separator="," />+
    </h3>
    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">High-Quality Products</p>
  </div>
  
  <div className="space-y-1 border-l-2 border-gray-300 pl-4 lg:pl-8">
    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
      <CountUp end={30000} duration={2.5} separator="," />+
    </h3>
    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">Happy Customers</p>
  </div>
</div>
            </div>

            <div className="relative h-[450px] lg:h-[650px] xl:h-[700px]">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/Model.png"
                  alt="hero-image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-72 h-72 lg:w-96 lg:h-96 bg-purple-200/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 lg:w-96 lg:h-96 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>
      </section>

      <section className="bg-black py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-white text-center">Loading brands...</div>
          ) : (
            <Marquee
              gradient={true}
              gradientColor="#000000"
              gradientWidth={50}
              speed={40}
              pauseOnHover={true}
            >
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wide mx-8 sm:mx-12 lg:mx-16 hover:scale-110 transition-transform cursor-pointer"
                  style={{ fontFamily: "serif" }}
                >
                  {brand.name.toUpperCase()}
                </div>
              ))}
            </Marquee>
          )}
        </div>
      </section>
    </div>
  );
}