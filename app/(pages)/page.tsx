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
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 lg:py-24">
            <div className="space-y-8 lg:space-y-10 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-border/50 text-sm font-medium text-muted-foreground">
                <span className="w-2 h-2 rounded-full gradient-primary animate-pulse" />
                New Collections Available
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-tight lg:leading-[1.08] tracking-tight">
                Find Brands<br />
                That <span className="text-gradient">Matches</span><br />
                Your Style
              </h1>

              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                Browse through our diverse range of meticulously crafted garments,
                designed to bring out your individuality and cater to your sense of style.
              </p>

              <Link href="/products">
                <Button className="gradient-primary hover:opacity-90 text-white px-10 lg:px-14 py-5 lg:py-6 rounded-full text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-[1.03] shadow-xl shadow-[oklch(0.38_0.18_270)]/20 mt-2">
                  Shop Now
                </Button>
              </Link>

              <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-6 lg:pt-10">
                <div className="glass-card rounded-2xl p-4 lg:p-5 text-center">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    <CountUp end={200} duration={2.5} />+
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">International Brands</p>
                </div>

                <div className="glass-card rounded-2xl p-4 lg:p-5 text-center">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    <CountUp end={2000} duration={2.5} separator="," />+
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">High-Quality Products</p>
                </div>

                <div className="glass-card rounded-2xl p-4 lg:p-5 text-center">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    <CountUp end={30000} duration={2.5} separator="," />+
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">Happy Customers</p>
                </div>
              </div>
            </div>

            <div className="relative h-[450px] lg:h-[650px] xl:h-[700px]">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-[oklch(0.38_0.18_270)]/10 ring-1 ring-border/30">
                <Image
                  src="/Model.png"
                  alt="hero-image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                  priority
                />
              </div>
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 gradient-primary rounded-2xl opacity-20 rotate-12 blur-sm" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 gradient-accent rounded-2xl opacity-25 -rotate-12 blur-sm" />
            </div>
          </div>
        </div>

        {/* Background decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 lg:w-96 lg:h-96 rounded-full blur-3xl -z-10 opacity-40" style={{ background: 'oklch(0.78 0.10 270 / 0.3)' }} />
        <div className="absolute bottom-20 left-10 w-72 h-72 lg:w-96 lg:h-96 rounded-full blur-3xl -z-10 opacity-30" style={{ background: 'oklch(0.78 0.12 75 / 0.3)' }} />
      </section>

      {/* Brands Marquee */}
      <section className="gradient-dark py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-gray-500 text-center text-sm">Loading brands...</div>
          ) : (
            <Marquee
              gradient={true}
              gradientColor="#121225"
              gradientWidth={80}
              speed={40}
              pauseOnHover={true}
            >
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="text-gray-400 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wide mx-8 sm:mx-12 lg:mx-16 hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
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