
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { categories } from '@/constants';
import { motion } from 'framer-motion';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    image_url: '',
    category: 'Electronics',
    stock: 0,
  });

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id);
      setProducts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('products').insert({
        ...newProduct,
        seller_id: user?.id,
        approval_status: 'pending',
      });
      setShowAddModal(false);
      setNewProduct({
        title: '',
        description: '',
        price: 0,
        image_url: '',
        category: 'Electronics',
        stock: 0,
      });
      fetchProducts();
      alert('Product added for approval!');
    } catch (error) {
      console.error(error);
      alert('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await supabase.from('products').delete().eq('id', id);
        fetchProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Please login first</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-orange-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your products and sales</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Add Product
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Products</h3>
            <p className="text-4xl font-black text-gray-900">{products.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Approved</h3>
            <p className="text-4xl font-black text-green-600">
              {products.filter(p => p.approval_status === 'approved').length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Pending</h3>
            <p className="text-4xl font-black text-orange-600">
              {products.filter(p => p.approval_status === 'pending').length}
            </p>
          </motion.div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Your Products</h2>
          </div>
          {loading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              No products yet. Add your first product!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product, idx) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image_url || 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20product%20placeholder%20image&image_size=square'}
                            alt={product.title}
                            className="w-16 h-16 rounded-2xl object-cover"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-gray-600">{product.category}</td>
                      <td className="px-8 py-6 font-bold text-gray-900">₹{(product.price_inr || product.price || 0).toFixed(2)}</td>
                      <td className="px-8 py-6 text-gray-600">{product.stock}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.approval_status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : product.approval_status === 'pending' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {product.approval_status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  rows={3}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image URL</label>
                <input
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-2xl font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  Add Product
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
