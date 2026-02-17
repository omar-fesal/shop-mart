"use client";

import { formatCurrency } from "@/Helpers/formatCurrency";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartRes } from "@/interfaces/CartInterfacrs";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import CheckOutSession from "../CheckOutSession/CheckOutSession";

interface CartProps {
  cartData: CartRes | null;
  token: string;
  userId?: string | null;
}

export default function Cart({ cartData, token, userId }: CartProps) {
    const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  if (!cartData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Add some items to get started!</p>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const cart = cartData.data;
  const itemCount = cartData.numOfCartItems;

  const updateQuantity = async (productId: string, newCount: number) => {
    if (newCount < 1) return;

    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
          body: JSON.stringify({ count: newCount }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Quantity updated!');
        router.refresh();
      } else {
        toast.error(data.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Something went wrong!');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeItem = async (productId: string) => {
    if (!confirm('Remove this item from cart?')) return;

    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          method: 'DELETE',
          headers: {
            token,
          },
        }
      );

      if (response.ok) {
        toast.success('Item removed!');
        router.refresh();
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Something went wrong!');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    setIsClearing(true);
    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
        method: 'DELETE',
        headers: {
          token,
        }
      });

      if (response.ok) {
        toast.success('Cart cleared!');
        router.refresh();
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error('Failed to clear cart');
    } finally {
      setIsClearing(false);
    }
  };

  return <>
    {cart ? 
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="text-muted-foreground mt-1">
          {itemCount} items in your cart
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start mt-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.products?.map((item) => {
              const product = typeof item.product === 'string' ? null : item.product;
              const isUpdating = updatingItems.has(item.product as string);
              
              if (!product) {
                return (
                  <div key={item._id} className="flex gap-4 rounded-xl border p-4 shadow-sm bg-card">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Loading product details...</p>
                    </div>
                  </div>
                );
              }

             return (
  <div key={item._id} className="flex gap-4 rounded-xl border p-4 shadow-sm bg-card relative">
    {isUpdating && (
      <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
        <Loader2 className="animate-spin" />
      </div>
    )}
    
    <img 
      src={product.imageCover}
      alt={product.title}
      className="w-24 h-24 rounded-lg object-cover md:w-28 md:h-28"
    />

    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-base md:text-lg line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {product.brand?.name} · {product.category?.name}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="font-semibold">
            {formatCurrency(item.price)}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
         
          <button
            onClick={() => updateQuantity(product._id, item.count - 1)}
            disabled={isUpdating || item.count <= 1}
            aria-label="decrease"
            className="size-8 rounded-lg border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          
          <span className="w-6 text-center font-medium">
            {item.count}
          </span>
          
        
          <button
            onClick={() => updateQuantity(product._id, item.count + 1)}
            disabled={isUpdating}
            aria-label="increase"
            className="size-8 rounded-lg border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

      
        <button
          onClick={() => removeItem(product._id)}
          disabled={isUpdating}
          className="text-sm text-destructive hover:underline disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
);
            })}
          </div>

          <div className="lg:col-span-1 sticky top-18">
            <div className="rounded-xl border p-5 shadow-sm bg-card">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(cart.totalCartPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>

              <div className="my-4 border-t" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">
                  {formatCurrency(cart.totalCartPrice)}
                </span>
              </div>

              <Link href="/products">
                <Button className="w-full mt-6" size="lg">
                  Continue Shopping
                </Button>
              </Link>
              <CheckOutSession cartId={cartData.cartId || ''}/>

              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="w-full mt-3 text-destructive hover:underline text-sm disabled:opacity-50"
              >
                {isClearing ? "Clearing..." : "Clear Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    : null}
  </>
}