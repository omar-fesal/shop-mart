"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Loader2, CreditCard, Banknote } from "lucide-react"

export default function CheckOutSession({ cartId }: { cartId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isCashLoading, setIsCashLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [cashOpen, setCashOpen] = useState(false)

  const [shippingAddress, setShippingAddress] = useState({
    details: "",
    phone: "",
    city: "",
  })

  const [cashShippingAddress, setCashShippingAddress] = useState({
    details: "",
    phone: "",
    city: "",
  })

  const handleCheckout = async () => {
    if (!shippingAddress.city || !shippingAddress.phone || !shippingAddress.details) {
      toast.error("Please fill all fields")
      return
    }

    if (!session?.accessToken) {
      toast.error("Please login first")
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      const baseUrl = window.location.origin
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${baseUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: session.accessToken,
        },
        body: JSON.stringify({ shippingAddress }),
      }
      )

      const data = await response.json()

      if (response.ok && data.session?.url) {
        window.location.href = data.session.url
      } else {
        toast.error(data.message || "Checkout failed")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Something went wrong!")
      setIsLoading(false)
    }
  }

  const handleCashCheckout = async () => {
    if (!cashShippingAddress.city || !cashShippingAddress.phone || !cashShippingAddress.details) {
      toast.error("Please fill all fields")
      return
    }

    if (!session?.accessToken) {
      toast.error("Please login first")
      router.push("/login")
      return
    }

    setIsCashLoading(true)

    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: session.accessToken,
          },
          body: JSON.stringify({ shippingAddress: cashShippingAddress }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        toast.success("Order placed successfully!")
        setCashOpen(false)
        window.location.href = "/allorders"
      } else {
        toast.error(data.message || "Order failed")
      }
    } catch (error) {
      console.error("Cash checkout error:", error)
      toast.error("Something went wrong!")
    } finally {
      setIsCashLoading(false)
    }
  }

  return (
    <div className="flex gap-2 mt-3">
      {/* Online Payment Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1 gradient-primary text-white hover:opacity-90 rounded-xl gap-2 transition-all shadow-lg shadow-[oklch(0.38_0.18_270)]/15" size="lg">
            <CreditCard className="w-4 h-4" />
            Pay Online
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Shipping Address</DialogTitle>
            <DialogDescription>
              Enter your shipping details for online payment
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Cairo"
                className="rounded-xl"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
              />
            </Field>

            <Field>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="01234567890"
                className="rounded-xl"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, phone: e.target.value })
                }
              />
            </Field>

            <Field>
              <Label htmlFor="details">Address Details</Label>
              <Input
                id="details"
                name="details"
                placeholder="Street, Building, Apartment"
                className="rounded-xl"
                value={shippingAddress.details}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, details: e.target.value })
                }
              />
            </Field>
          </FieldGroup>

          <div className="flex gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 rounded-xl">
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="flex-1 gradient-primary text-white hover:opacity-90 rounded-xl"
            >
              {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
              Continue to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cash on Delivery Dialog */}
      <Dialog open={cashOpen} onOpenChange={setCashOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl gap-2 transition-all" size="lg">
            <Banknote className="w-4 h-4" />
            Cash on Delivery
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Shipping Address</DialogTitle>
            <DialogDescription>
              Enter your shipping details for cash on delivery
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="cash-city">City</Label>
              <Input
                id="cash-city"
                name="city"
                placeholder="Cairo"
                className="rounded-xl"
                value={cashShippingAddress.city}
                onChange={(e) =>
                  setCashShippingAddress({ ...cashShippingAddress, city: e.target.value })
                }
              />
            </Field>

            <Field>
              <Label htmlFor="cash-phone">Phone</Label>
              <Input
                id="cash-phone"
                name="phone"
                type="tel"
                placeholder="01234567890"
                className="rounded-xl"
                value={cashShippingAddress.phone}
                onChange={(e) =>
                  setCashShippingAddress({ ...cashShippingAddress, phone: e.target.value })
                }
              />
            </Field>

            <Field>
              <Label htmlFor="cash-details">Address Details</Label>
              <Input
                id="cash-details"
                name="details"
                placeholder="Street, Building, Apartment"
                className="rounded-xl"
                value={cashShippingAddress.details}
                onChange={(e) =>
                  setCashShippingAddress({ ...cashShippingAddress, details: e.target.value })
                }
              />
            </Field>
          </FieldGroup>

          <div className="flex gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 rounded-xl">
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleCashCheckout}
              disabled={isCashLoading}
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl"
            >
              {isCashLoading && <Loader2 className="animate-spin mr-2" size={16} />}
              Place Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}