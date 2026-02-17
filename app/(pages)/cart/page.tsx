import { authOptions } from "@/lib/auth";
import Cart from "@/components/Cart/Cart";
import { CartRes } from "@/interfaces/CartInterfacrs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect('/login');
  }

  try {
    console.log('🛒 Fetching cart...');
    
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/cart",
      {
        headers: {
          token: session.accessToken,
        },
        cache: 'no-store'
      }
    );

    console.log('📡 Cart response status:', response.status);

    if (response.status === 401) {
      console.log('❌ Unauthorized');
      redirect('/login');
    }

    if (!response.ok) {
      console.log('⚠️ Cart is empty or error');
      return <Cart cartData={null} token={session.accessToken} />;
    }

    const data: CartRes = await response.json();
    console.log('✅ Cart items:', data.numOfCartItems);

    const userId = data.data?.cartOwner || null;

    if (data.data && data.data.products.length > 0) {
      const productsWithDetails = await Promise.all(
        data.data.products.map(async (item) => {
          try {
            const productRes = await fetch(
              `https://ecommerce.routemisr.com/api/v1/products/${item.product}`,
              { cache: 'no-store' }
            );
            
            if (productRes.ok) {
              const productData = await productRes.json();
              return {
                ...item,
                product: productData.data
              };
            }
            return item;
          } catch (error) {
            console.error('Error fetching product:', error);
            return item;
          }
        })
      );

      data.data.products = productsWithDetails;
    }

    return (
      <Cart
        cartData={data.numOfCartItems == 0 ? null : data}
        token={session.accessToken}
        userId={userId}
      />
    );
  } catch (error) {
    console.error('❌ Cart fetch error:', error);
    return <Cart cartData={null} token={session.accessToken} userId={null} />;
  }
}