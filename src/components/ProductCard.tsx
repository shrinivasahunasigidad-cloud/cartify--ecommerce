
'use client';

import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
      alert('Added to cart!');
    } catch (error) {
      alert('Please login first');
    }
  };

  const price = product.price_inr || product.price || 0;
  const stock = product.stock || 10;
  const rating = product.rating || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Image%20unavailable%20placeholder&image_size=square';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-orange-600 uppercase tracking-wider">{product.category}</span>
          <div className="flex items-center gap-1 text-yellow-600 text-sm">
            {'★'.repeat(Math.floor(rating))}
            {'☆'.repeat(5 - Math.floor(rating))}
            <span className="text-gray-500 ml-1 text-xs">{rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{product.title}</h3>
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xl font-bold text-orange-600">₹{price.toFixed(2)}</span>
          <div className="flex gap-2">
            {product.product_url && (
              <motion.a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:bg-gray-200 transition-all"
              >
                View Product
              </motion.a>
            )}
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:bg-orange-700 transition-all"
              disabled={stock <= 0}
            >
              {stock <= 0 ? 'Out' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
