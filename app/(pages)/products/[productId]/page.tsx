import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/interfaces/productinterfacr';
import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import Slider from '../../../../components/Slider/Slider';
import AddToCart from '@/components/AddToCart/AddToCart';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetails({ params }: Props) {
  const { productId } = await params;

  const session = await getServerSession(authOptions);

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products/${productId}`,
    { cache: 'no-store' }
  );

  if (!res.ok) notFound();

  const data: { data: Product } = await res.json();
  if (!data?.data) notFound();
  const product = data.data;

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < Math.floor(rating)
            ? 'text-amber-400 fill-amber-400'
            : 'text-gray-200 fill-gray-200'
          }`}
      />
    ));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <Card className="overflow-hidden border border-border/50 shadow-sm">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">

            {/* Image Gallery */}
            <div className="flex items-center justify-center bg-secondary/20 rounded-2xl p-8">
              <Slider
                images={product.images || []}
                title={product.title || 'Product'}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-5">
              {/* Brand & Category badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.brand?.name && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {product.brand.name}
                  </span>
                )}
                {product.category?.name && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground">
                    {product.category.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-relaxed tracking-tight">
                {product.title}
              </h1>

              <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                {product.description}
              </p>

              {/* Rating & Price */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(product.ratingsAverage || 0)}</div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {product.ratingsAverage || 0}
                  </span>
                </div>
                <span className="text-2xl lg:text-3xl font-bold text-foreground">
                  {product.price} <span className="text-base font-medium text-muted-foreground">EGP</span>
                </span>
              </div>

              {/* Add to Cart */}
              <div className="pt-4">
                <AddToCart productId={product._id} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}