"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addToCartAction(productId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    return { 
      success: false, 
      message: "Please login first" 
    };
  }

  try {
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
      headers: {
        token: session.accessToken, 
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to add to cart",
        data
      };
    }

    revalidatePath('/cart');
    
    return {
      success: true,
      message: "Product added to cart successfully!",
      data
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      message: "Something went wrong"
    };
  }
}