
export interface CartProduct {
  count: number;
  _id: string;
  product: string | Product; 
  price: number;
}

export interface Product {
  _id: string;
  title: string;
  imageCover: string;
  category: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  description?: string;
  price?: number;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface CartRes {
  status: string;
  message?: string;
  numOfCartItems: number;
  cartId?: string;
  data: CartData;
}