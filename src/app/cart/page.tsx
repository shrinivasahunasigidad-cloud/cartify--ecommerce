
'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-6 p-6 border-b">
            <img
              src={item.product.image_url}
              alt={item.product.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{item.product.title}</h3>
              <p className="text-gray-600">₹{(item.product.price_inr || item.product.price || 0).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.product_id)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-orange-600">₹{cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 text-lg font-semibold transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
