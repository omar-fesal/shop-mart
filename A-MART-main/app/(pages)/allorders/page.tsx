import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/Helpers/formatCurrency'
import { Package, Calendar, MapPin, CreditCard } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

interface OrderProduct {
  count: number
  _id: string
  product: {
    _id: string
    title: string
    imageCover: string
    category: { _id: string; name: string }
    brand: { _id: string; name: string }
  }
  price: number
}

interface Order {
  shippingAddress: {
    details: string
    phone: string
    city: string
  }
  taxPrice: number
  shippingPrice: number
  totalOrderPrice: number
  paymentMethodType: string
  isPaid: boolean
  isDelivered: boolean
  _id: string
  user: string
  cartItems: OrderProduct[]
  createdAt: string
  id: number
}

async function getOrders(userId: string, token: string) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
      {
        headers: { token },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

async function getUserIdFromCart(token: string) {
  try {
    const response = await fetch(
      'https://ecommerce.routemisr.com/api/v1/cart',
      {
        headers: { token },
        cache: 'no-store',
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    return data.data?.cartOwner || null
  } catch (error) {
    console.error('Error fetching cart:', error)
    return null
  }
}

export default async function AllOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect('/login')
  }

  let userId = (await cookies()).get('userId')?.value || 
               (await cookies()).get('cartOwnerId')?.value

  if (!userId) {
    userId = await getUserIdFromCart(session.accessToken)
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">No Orders Yet</h1>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-lg bg-black text-white px-6 py-3 hover:bg-gray-800"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  const orders: Order[] = await getOrders(userId, session.accessToken)

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">No Orders Yet</h1>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-lg bg-black text-white px-6 py-3 hover:bg-gray-800"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground mt-1">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} in total
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/50 px-6 py-4 border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono font-semibold">#{order.id}</p>
                  </div>
                  <div className="hidden sm:block w-px h-10 bg-border" />
                  <div className="hidden sm:block">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                {order.cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-1">{item.product.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product.brand.name} · {item.product.category.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-muted-foreground">Qty: {item.count}</span>
                        <span className="font-semibold">{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Shipping Address</p>
                      <p className="text-sm text-muted-foreground">{order.shippingAddress.details}</p>
                      <p className="text-sm text-muted-foreground">{order.shippingAddress.city}</p>
                      <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium text-sm">Payment Method</p>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">{order.paymentMethodType}</p>

                  <div className="pt-3 space-y-1">
                    {order.taxPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>{formatCurrency(order.taxPrice)}</span>
                      </div>
                    )}
                    {order.shippingPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{formatCurrency(order.shippingPrice)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>{formatCurrency(order.totalOrderPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}