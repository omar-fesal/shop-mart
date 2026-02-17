'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface ProductCarouselProps {
  images: string[];
  title: string;
  sizes?: string; 
}

export default function Slider({ images = [], title, sizes = "100vw" }: ProductCarouselProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
      className="w-full"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-square bg-gray-50 rounded-lg">
              <Image
                src={image}
                alt={`${title} - Image ${index + 1}`}
                fill
                sizes={sizes} 
                className="object-contain p-4"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
