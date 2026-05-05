import React, { useState, useEffect } from 'react';

const ProductDetails = ({ productId, onClose }) => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryFollowed, setCategoryFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchCategoryFollowStatus = async (categoryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCategoryFollowed(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/categories/${categoryId}/follow-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCategoryFollowed(data.followed);
    } catch (err) {
      console.error('Follow status error:', err);
    }
  };

  const toggleFollowCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to follow this category.');
      return;
    }

    setFollowLoading(true);
    try {
      const method = categoryFollowed ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:5000/api/categories/${categoryId}/follow`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Unable to update follow status');
      }
      setCategoryFollowed((prev) => !prev);
    } catch (err) {
      console.error('Follow toggle error:', err);
      alert('Unable to update follow status. Please try again.');
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = () => {
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProductData(data);
        setLoading(false);
        if (data?.product?.category_id) {
          fetchCategoryFollowStatus(data.product.category_id);
        }
      })
      .catch(err => {
        console.error("Product details error:", err);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return null;
  }

  const { product, experiences } = productData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Product Details & Reviews</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Product Information */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
              {product.product_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-green-600 text-xs font-black uppercase tracking-widest">PRODUCT</span>
                <span className="text-green-600 text-xs font-black uppercase tracking-widest">{product.category_name}</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{product.product_name}</h3>
              <p className="text-gray-600 text-sm mb-3">Used for: <span className="font-semibold text-green-700">{product.usage_duration}</span></p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-700 text-sm font-semibold mb-1">✓ Pros:</p>
                  <p className="text-sm text-gray-700">{product.pros || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-red-600 text-sm font-semibold mb-1">✗ Cons:</p>
                  <p className="text-sm text-gray-700">{product.cons || "Not specified"}</p>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mt-4">{product.content || "No description available."}</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => toggleFollowCategory(product.category_id)}
                  disabled={followLoading}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all ${categoryFollowed ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-green-600 text-white hover:bg-green-700'} ${followLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {categoryFollowed ? 'Following category' : 'Follow category'}
                </button>
                <p className="text-xs text-gray-500 mt-2">Follow this category to get notifications when new products or experiences are added.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">User Reviews ({experiences.length})</h3>
          
          {experiences.length > 0 ? (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <div key={experience.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden shrink-0 bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                      {experience.avatar_url ? (
                        <img src={experience.avatar_url} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        'U'
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{experience.username || `User #${experience.user_id}`}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < experience.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{new Date(experience.created_at).toLocaleDateString()}</p>
                      <p className="font-medium text-sm text-gray-800 mb-2">{experience.title}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{experience.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product_name, usage_duration, pros, cons, content, category, onAddExperience, onViewDetails, user }) => (
  <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all border border-green-100 group">
    <div className="aspect-16/10 rounded-2xl overflow-hidden mb-5 relative bg-linear-to-br from-green-500 to-emerald-600">
      <div className="w-full h-full flex items-center justify-center text-white">
        <svg className="w-20 h-20 opacity-40" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        PRODUCT
      </div>
    </div>
    <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">{category}</span>
    <h3 className="text-xl font-bold mb-2 mt-1 text-gray-800">{product_name}</h3>
    <p className="text-gray-600 text-xs mb-2">Used for: <span className="font-semibold text-green-700">{usage_duration}</span></p>

    <div className="mb-3 pb-3 border-b border-green-200">
      <p className="text-green-700 text-xs font-semibold mb-1">✓ Pros: {pros}</p>
      <p className="text-red-600 text-xs font-semibold">✗ Cons: {cons}</p>
    </div>

    <p className="text-gray-700 text-sm line-clamp-2 mb-4">{content}</p>

    <div className="flex flex-col gap-3 pt-4 border-t border-green-200">
      {user ? (
        <button
          type="button"
          onClick={onAddExperience}
          className="w-full rounded-full bg-green-600 text-white py-3 text-sm font-semibold hover:bg-green-700 transition-all"
        >
          + Add your review
        </button>
      ) : (
        <button
          type="button"
          onClick={() => alert('Please log in to add a review')}
          className="w-full rounded-full bg-gray-400 text-white py-3 text-sm font-semibold cursor-not-allowed"
        >
          Login to Add Review
        </button>
      )}
      <button className="w-full rounded-full border border-green-300 text-green-700 py-3 text-sm font-semibold hover:border-green-400 hover:bg-green-50 transition-all" onClick={onViewDetails}>
        View Details
      </button>
    </div>
  </div>
);

const ProductsPage = ({ refreshTrigger, onAddExperience, user }) => {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [refreshTrigger]);

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Data loading error:", err));
  };

  const fetchCategories = () => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        const categoryNames = Array.isArray(data) ? data.map((item) => item.name) : [];
        setProductCategories(categoryNames);
      })
      .catch(err => {
        console.error('Category loading error:', err);
        setProductCategories([]);
      });
  };

  const filteredProducts = filterCategory === 'All'
    ? products
    : products.filter(product => product.category_name === filterCategory);

  return (
    <div className="p-12">
      <header className="mb-12">
        <span className="text-green-600 text-xs font-bold uppercase tracking-widest">🛍️ Product Reviews</span>
        <h1 className="text-5xl font-extrabold mb-4 mt-1 text-gray-800">Find the Best Products</h1>
        <p className="text-gray-600 text-lg mb-6">Discover and review products from real users</p>
        <div className="flex flex-wrap items-center gap-3 mt-10">
          {['All', ...productCategories].map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                filterCategory === category
                  ? 'bg-brand-orange text-white'
                  : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.length > 0 ? filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            category={product.category_name} 
            product_name={product.product_name}
            usage_duration={product.usage_duration}
            pros={product.pros || "Not specified"}
            cons={product.cons || "Not specified"}
            content={product.content || "No description available."}
            onAddExperience={() => onAddExperience(product)}
            onViewDetails={() => setSelectedProductId(product.id)}
            user={user}
          />
        )) : (
          <p className="text-gray-400">No products found for this category.</p>
        )}
      </div>

      {selectedProductId && (
        <ProductDetails 
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
};

export default ProductsPage;