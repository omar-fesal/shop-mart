"use client";

import { formatCurrency } from "@/Helpers/formatCurrency";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartRes } from "@/interfaces/CartInterfacrs";
import toast from "react-hot-toast";
import { Loader2, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
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
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to get started!</p>
          <Link href="/products">
            <Button size="lg" className="gradient-primary text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[oklch(0.38_0.18_270)]/20">
              Continue Shopping
            </Button>
          </Link>
        </div>
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
        window.dispatchEvent(new Event("cartUpdates"));
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
        window.dispatchEvent(new Event("cartUpdates"));
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
        window.dispatchEvent(new Event("cartUpdates"));
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.products?.map((item) => {
              const product = typeof item.product === 'string' ? null : item.product;
              const isUpdating = updatingItems.has(item.product as string);

              if (!product) {
                return (
                  <div key={item._id} className="flex gap-4 rounded-2xl border border-border/50 p-5 bg-card">
                    <div className="w-24 h-24 shimmer rounded-xl" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Loading product details...</p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item._id} className="flex gap-5 rounded-2xl border border-border/50 p-5 bg-card relative group hover:border-border transition-colors">
                  {isUpdating && (
                    <div className="absolute inset-0 bg-card/70 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                      <Loader2 className="animate-spin text-[oklch(0.38_0.18_270)]" />
                    </div>
                  )}

                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="w-24 h-24 rounded-xl object-cover md:w-28 md:h-28 bg-secondary/20"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-base md:text-lg line-clamp-2 leading-snug">
                          {product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1.5">
                          {product.brand?.name} · {product.category?.name}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-lg">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(product._id, item.count - 1)}
                          disabled={isUpdating || item.count <= 1}
                          aria-label="decrease"
                          className="size-9 rounded-xl border border-border/50 hover:bg-secondary/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="w-10 text-center font-semibold text-sm">
                          {item.count}
                        </span>

                        <button
                          onClick={() => updateQuantity(product._id, item.count + 1)}
                          disabled={isUpdating}
                          aria-label="increase"
                          className="size-9 rounded-xl border border-border/50 hover:bg-secondary/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(product._id)}
                        disabled={isUpdating}
                        className="text-sm text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 sticky top-20">
            <div className="rounded-2xl border border-border/50 p-6 bg-card shadow-sm">
              <h2 className="text-lg font-bold">Order Summary</h2>
              <div className="mt-5 space-y-3">
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
                  <span className="text-emerald-500 font-medium text-sm">Free</span>
                </div>
              </div>

              <div className="my-5 border-t border-border/50" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">
                  {formatCurrency(cart.totalCartPrice)}
                </span>
              </div>

              <Link href="/products">
                <Button className="w-full mt-6 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80" size="lg">
                  Continue Shopping
                </Button>
              </Link>
              <CheckOutSession cartId={cartData.cartId || ''} />

              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="w-full mt-3 text-muted-foreground hover:text-destructive text-sm disabled:opacity-40 transition-colors"
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