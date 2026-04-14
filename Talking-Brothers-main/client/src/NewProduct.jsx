import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { fetchCategoriesFromApi } from './categoryService';

const NewProduct = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    usage_duration: '',
    pros: '',
    cons: '',
    content: ''
  });
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategoriesFromApi()
      .then((data) => {
        setProductCategories(data.map((item) => item.name));
      })
      .catch((err) => {
        console.error('Category fetch error:', err);
        setProductCategories([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a product');
      return;
    }
    setLoading(true);

    try {
      const productData = {
        user_id: user.id,
        category_name: formData.category,
        product_name: formData.product_name,
        usage_duration: formData.usage_duration,
        pros: formData.pros,
        cons: formData.cons,
        content: formData.content
      };

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || 'Could not create product.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Share a Product Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="e.g., Sony WH-1000XM5 Headphones"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">Select a category</option>
              {productCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Duration *
            </label>
            <input
              type="text"
              name="usage_duration"
              value={formData.usage_duration}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="e.g., 6 months, 2 years"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pros (Strengths)
            </label>
            <textarea
              name="pros"
              value={formData.pros}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
              placeholder="What did you like about this product?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cons (Weaknesses)
            </label>
            <textarea
              name="cons"
              value={formData.cons}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
              placeholder="What could be improved?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Feedback *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
              placeholder="Share your detailed experience with this product..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-brand-orange text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Share Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;