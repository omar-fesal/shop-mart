import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";

interface OrderProduct {
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category?: {
      name: string;
    };
    brand?: {
      name: string;
    };
  };
}

interface Order {
  _id: string;
  id: number;
  cartItems: OrderProduct[];
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  shippingAddress?: {
    details?: string;
    phone?: string;
    city?: string;
  };
}

export default async function AllOrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) redirect("/login");

  let orders: Order[] = [];
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      orders = await res.json();
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">No Orders Yet</h1>
          <p className="text-muted-foreground mb-8">
            Once you place an order, it will appear here
          </p>
          <Link href="/products">
            <Button size="lg" className="gradient-primary text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[oklch(0.38_0.18_270)]/20">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"} found
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Order Header */}
            <div className="p-5 border-b border-border/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-base">Order #{order.id}</h3>
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${order.isPaid
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${order.isDelivered
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {order.isDelivered ? "Delivered" : "In Transit"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {order.paymentMethodType === "card" ? "Online Payment" : "Cash on Delivery"}
                </p>
              </div>

              <div className="text-right">
                <span className="text-lg font-bold">{order.totalOrderPrice} EGP</span>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="px-5 py-3 bg-secondary/20 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {order.shippingAddress.city}
                  {order.shippingAddress.details && ` · ${order.shippingAddress.details}`}
                </span>
              </div>
            )}

            {/* Order Items */}
            <div className="p-5">
              <div className="space-y-3">
                {order.cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary/20 shrink-0">
                      <Image
                        src={item.product.imageCover}
                        alt={item.product.title}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.count} · {item.price} EGP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}