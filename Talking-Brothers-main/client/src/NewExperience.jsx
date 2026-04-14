import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchCategoriesFromApi } from './categoryService';

const NewExperience = ({ onClose, onSuccess, productName = '', initialCategoryName = '', initialTitle = '', productId = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: initialTitle,
    category_name: '',
    location: '',
    content: '',
    rating: 5
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategoriesFromApi()
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error('Category fetch error:', err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      title: initialTitle || prev.title,
      category_name: initialCategoryName || prev.category_name
    }));
  }, [initialTitle, initialCategoryName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create an experience');
      return;
    }
    setLoading(true);

    try {
      const experienceData = {
        user_id: user.id,
        ...formData,
        ...(productId && { product_id: productId })
      };

      const response = await fetch('http://localhost:5000/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(experienceData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || 'Could not create experience.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error creating experience');
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
        <h2 className="text-2xl font-bold">Share a New Experience</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {productName && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4">
              <p className="text-xs uppercase font-semibold text-brand-orange mb-2">Product context</p>
              <p className="text-sm font-semibold text-gray-900">{productName}</p>
              <p className="text-xs text-gray-500">Your experience will be connected to this product.</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder={productName ? `Share your ${productName} experience title` : 'Brief title of your experience'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {!productName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="City, venue name, etc."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Details *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
              placeholder="Describe your experience in detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5) *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating }))}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                    formData.rating >= rating
                      ? 'bg-brand-orange text-white'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
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
              className="flex-1 px-6 py-3 bg-brand-blue text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewExperience;