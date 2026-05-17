
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price_inr: number;
  rating: number;
  image_url: string;
  product_url: string;
  description: string;
  stock?: number;
  price?: number;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
}
