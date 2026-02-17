"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft } from "lucide-react";
import AddToCart from "@/components/AddToCart/AddToCart";
import { useSession } from "next-auth/react";
import Loading from "@/app/(pages)/products/loading";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  brand?: {
    _id: string;
    name: string;
  };
  category?: {
    _id: string;
    name: string;
  };
}

interface CategoryResponse {
  data: Category;
}

interface ProductsResponse {
  results: number;
  data: Product[];
}

interface Props {
  params: Promise<{ categoryId: string }>;
}

export default function CategoryDetailsPage({ params }: Props) {
  const { data: session } = useSession();
  const [categoryId, setCategoryId] = useState<string>("");
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setCategoryId(p.categoryId));
  }, [params]);

  useEffect(() => {
    if (!categoryId) return;

    const fetchData = async () => {
      try {
        const categoryRes = await fetch(
          `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}`,
          { cache: "no-store" }
        );

        if (categoryRes.ok) {
          const categoryData: CategoryResponse = await categoryRes.json();
          setCategory(categoryData.data);
        }

        const productsRes = await fetch(
          `https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`,
          { cache: "no-store" }
        );

        if (productsRes.ok) {
          const productsData: ProductsResponse = await productsRes.json();
          setProducts(productsData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

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

  if (loading) {
    return <Loading />;
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Category not found</h2>
        <Link href="/categories">
          <Button className="gradient-primary text-white">Back to Categories</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/categories">
        <Button variant="outline" className="mb-6 rounded-xl gap-2 hover:bg-secondary/60 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Categories
        </Button>
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{category.name}</h1>
        <p className="text-muted-foreground mt-2">Products from this category</p>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">No products available in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden border border-border/50 card-hover group"
            >
              <Link href={`/products/${product._id}`}>
                <div className="relative w-full aspect-square bg-secondary/20 cursor-pointer overflow-hidden">
                  <Image
                    src={product.imageCover}
                    alt={product.title || "Product"}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
              </Link>

              <CardContent className="p-4 space-y-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {product.brand?.name || "No Brand"}
                </CardDescription>

                <Link href={`/products/${product._id}`}>
                  <CardTitle className="text-base font-semibold line-clamp-1 hover:text-[oklch(0.38_0.18_270)] transition-colors cursor-pointer">
                    {product.title}
                  </CardTitle>
                </Link>

                <CardDescription className="text-xs text-muted-foreground">
                  {product.category?.name || "No Category"}
                </CardDescription>

                <div className="flex items-center gap-2 pt-2">
                  <div className="flex">{renderStars(product.ratingsAverage)}</div>
                  <span className="text-xs text-muted-foreground">
                    ({product.ratingsQuantity || 0})
                  </span>
                </div>

                <div className="text-lg font-bold text-foreground">
                  EGP {product.price}
                </div>
              </CardContent>

              {session?.accessToken && (
                <div className="px-4 pb-4">
                  <AddToCart productId={product._id} />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}