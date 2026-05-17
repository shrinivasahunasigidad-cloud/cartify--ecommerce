
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-50">
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-6">
              <Link href="/" className="group">
                <motion.span 
                  className="text-3xl font-black bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Cartify
                </motion.span>
              </Link>
              <Link href="/sell">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Sell on Cartify
                </motion.button>
              </Link>
            </div>
            
            <div className="flex items-center gap-8">
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-gray-700 hover:text-orange-600 transition-all font-medium">
                  Admin
                </Link>
              )}
              {user ? (
                <>
                  <Link href="/orders" className="text-gray-700 hover:text-orange-600 transition-all font-medium">
                    Orders
                  </Link>
                  <Link href="/cart" className="relative text-gray-700 hover:text-orange-600 transition-all font-medium">
                    Cart
                    {cartCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs font-bold rounded-full px-3 py-1 shadow-lg"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </Link>
                  <motion.button
                    onClick={signOut}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Sign Out
                  </motion.button>
                </>
              ) : (
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Sign In
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-black text-white text-center tracking-tight"
          >
            Find It. Love It. <span className="text-yellow-300">Cartify It.</span>
          </motion.p>
        </div>
      </div>
    </nav>
  );
}
