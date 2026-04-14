import React, { useState, useEffect } from 'react';
import NewExperience from './NewExperience';
import NotificationBadge from './NotificationBadge';
import NotificationsPanel from './NotificationsPanel';
import LoginPage from './LoginPage';
import NewProduct from './NewProduct';
import ProductsPage from './ProductsPage';
import DashboardPage from './DashboardPage';
import { useAuth } from './AuthContext';

// --- BİLEŞENLER (COMPONENTS) ---

// 1. Ortak Navigasyon Barı (image_5.png referanslı)
const Header = ({ activePage, setActivePage, onAddExperience, onAddProduct, onAvatarClick, user, onLogout, onNotificationClick }) => {
  const navLinks = ['Dashboard', 'Experiences', 'Products', 'Profile'];
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-lg">X</div>
          <span className="text-2xl font-black text-brand-blue">Xplora</span>
        </div>
        
        <div className="flex items-center gap-6">
          {navLinks.map(link => (
            <button 
              key={link} 
              onClick={() => setActivePage(link)}
              className={`pb-1 text-sm font-medium transition-colors ${activePage === link ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500 hover:text-black'}`}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <button
                onClick={onAddExperience}
                className="bg-brand-blue text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700"
              >
                + NEW EXPERIENCE
              </button>
              <button
                onClick={onAddProduct}
                className="bg-brand-orange text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-700"
              >
                + NEW PRODUCT
              </button>
            </>
          )}
          {user && (
            <div className="relative">
              <button
                onClick={onNotificationClick}
                className="w-10 h-10 rounded-full border-2 border-gray-100 hover:border-brand-blue transition-colors flex items-center justify-center bg-gray-100"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8c0-3.31-2.69-6-6-6S6 4.69 6 8c0 7-3 8-3 8h18s-3-1-3-8" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <NotificationBadge userId={user.id} />
              </button>
            </div>
          )}
          <div className="relative">
            <button
              onClick={onAvatarClick}
              className="w-10 h-10 rounded-full border-2 border-gray-100 overflow-hidden hover:border-brand-blue transition-colors flex items-center justify-center bg-gray-100"
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </button>
            {user && (
              <button
                onClick={onLogout}
                className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 shadow-lg"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

// 2. Experience Details Modal
const ExperienceDetails = ({ experience, onClose }) => {
  if (!experience) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Experience Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Experience Information */}
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
              {experience.title.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-blue-600 text-xs font-black uppercase tracking-widest">EXPERIENCE</span>
                <span className="text-blue-600 text-xs font-black uppercase tracking-widest">{experience.category_name}</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{experience.title}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⭐ {experience.rating}/5</span>
              </div>

              {experience.location && (
                <p className="text-gray-600 text-sm mb-3">📍 Location: <span className="font-semibold text-blue-700">{experience.location}</span></p>
              )}

              <p className="text-gray-700 text-sm mb-4">{experience.content}</p>

              {experience.username && (
                <div className="flex items-center gap-2 pt-4 border-t border-blue-200">
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-xs">
                    {experience.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{experience.username}</p>
                    <p className="text-xs text-gray-500">{new Date(experience.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Experience Card
const ExperienceCard = ({ experience, onViewDetails }) => (
  <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all border border-blue-100 group cursor-pointer" onClick={onViewDetails}>
    <div className="aspect-16/10 rounded-2xl overflow-hidden mb-5 relative">
      <img src={`https://source.unsplash.com/random/600x400?${experience.category_name}`} alt={experience.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        EXPERIENCE
      </div>
      <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600">
        ⭐ {experience.rating}
      </span>
    </div>
    <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{experience.category_name}</span>
    <h3 className="text-xl font-bold mb-2 mt-1 text-gray-800">{experience.title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">{experience.content}</p>
    <div className="flex justify-between items-center pt-4 border-t border-blue-200">
      <span className="font-bold text-lg text-blue-700">{experience.rating}/5</span>
      <button className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all" onClick={(e) => { e.stopPropagation(); onViewDetails(); }}>
        →
      </button>
    </div>
  </div>
);

// --- PAGES ---

// 4. Explore Page
const ExperiencesPage = ({ refreshTrigger }) => {
  const [experiences, setExperiences] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);

  const fetchExperiences = () => {
    fetch('http://localhost:5000/api/experiences')
      .then(res => res.json())
      .then(data => setExperiences(data))
      .catch(err => console.error("Data loading error:", err));
  };

  const fetchCategories = () => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        const categoryNames = Array.isArray(data) ? data.map((item) => item.name) : [];
        setCategories(['All', ...categoryNames]);
      })
      .catch(err => {
        console.error('Category loading error:', err);
        setCategories(['All']);
      });
  };

  useEffect(() => {
    fetchExperiences();
    fetchCategories();
  }, [refreshTrigger]);

  const filterCategories = categories;
  const filteredExperiences = filterCategory === 'All'
    ? experiences
    : experiences.filter(exp => exp.category_name === filterCategory);

  const selectedExperience = experiences.find(exp => exp.id === selectedExperienceId);

  return (
    <>
      <div className="p-12">
        <header className="mb-12">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">🌟 Personal Experiences</span>
          <h1 className="text-5xl font-extrabold mb-4 mt-1 text-gray-800">Discover Reality</h1>
          <p className="text-gray-600 text-lg mb-6">Share and explore authentic experiences from around the world</p>
          <div className="flex flex-wrap items-center gap-3 mt-10">
            {filterCategories.map((category) => (
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
          {filteredExperiences.length > 0 ? filteredExperiences.map((exp) => (
            <ExperienceCard 
              key={exp.id}
              experience={exp}
              onViewDetails={() => setSelectedExperienceId(exp.id)}
            />
          )) : (
            <p className="text-gray-400">No experiences found for this category.</p>
          )}
        </div>
      </div>

      {selectedExperience && (
        <ExperienceDetails 
          experience={selectedExperience}
          onClose={() => setSelectedExperienceId(null)}
        />
      )}
    </>
  );
};

// 2. Profile Page
const ProfilePage = ({ user, onLoginClick }) => {
  const [filterType, setFilterType] = useState('All');
  const [experiences, setExperiences] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    // Fetch all experiences and filter by user
    fetch('http://localhost:5000/api/experiences')
      .then(res => res.json())
      .then(data => {
        const userExperiences = data.filter(exp => exp.user_id === user.id);
        setExperiences(userExperiences);
      })
      .catch(err => {
        console.error("Data fetch error:", err);
        setExperiences([]); // Set empty array on error
      });

    // Fetch all products and filter by user
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const userProducts = data.filter(prod => prod.user_id === user.id);
        setProducts(userProducts);
      })
      .catch(err => {
        console.error("Products fetch error:", err);
        setProducts([]); // Set empty array on error
      });
  }, [user]);

  if (!user) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-400 mb-4">Please log in to view your profile</p>
        <button 
          onClick={onLoginClick}
          className="bg-brand-blue text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="pb-12">
        {/* Cover Section */}
        <div className="relative h-80 bg-linear-to-r from-brand-blue to-blue-600 rounded-b-3xl overflow-hidden mb-20">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 400">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="1200" height="400" fill="url(#grid)" />
          </svg>
        </div>
        </div>

        {/* Profile Header */}
        <div className="max-w-7xl mx-auto px-6 -mt-24 mb-12 relative z-10">
        <div className="flex items-end gap-8">
          <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>
          <div className="pb-4">
            <h1 className="text-4xl font-extrabold mb-1">{user.username}</h1>
            <p className="text-gray-600 text-lg mb-3">{user.email}</p>
            <div className="flex gap-3">
              <span className="bg-brand-orange text-white text-xs font-bold px-4 py-2 rounded-full">📍 Member</span>
              <span className="bg-brand-blue text-white text-xs font-bold px-4 py-2 rounded-full">✅ Active User</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-6">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Explorer across 40+ countries with a passion for urban discovery and cafe culture. Expert at finding hidden gems.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-blue">{experiences.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Experiences</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-orange">{products.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Products</p>
                </div>
              </div>

              <button className="w-full bg-brand-blue text-white py-2 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Contributions Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Shared Contributions</h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-8 pb-4 border-b border-gray-200">
                {['All', 'Experiences', 'Products'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      filterType === f 
                        ? 'bg-brand-orange text-white' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Contributions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Show filtered content */}
                {(filterType === 'All' || filterType === 'Experiences') && experiences.map((exp) => (
                  <div key={`exp-${exp.id}`} className="bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:border-blue-200 cursor-pointer" onClick={() => setSelectedExperienceId(exp.id)}>
                    <div className="h-32 bg-linear-to-r from-brand-blue to-blue-600 relative overflow-hidden">
                      <img src={`https://source.unsplash.com/random/300x200?${exp.category_name}`} alt={exp.title} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-brand-blue">
                        EXPERIENCE
                      </div>
                      <div className="absolute top-3 left-3 bg-brand-blue text-white px-2 py-1 rounded-lg text-xs font-bold">
                        {exp.category_name}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{exp.title}</h4>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{exp.content}</p>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-xs font-semibold text-brand-blue">⭐ {exp.rating}/5</span>
                        <span className="text-xs text-gray-400">Experience</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show products when filter is All or Products */}
                {(filterType === 'All' || filterType === 'Products') && products.map((prod) => (
                  <div key={`prod-${prod.id}`} className="bg-linear-to-br from-green-50 to-white rounded-2xl border border-green-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:border-green-200">
                    <div className="h-32 bg-linear-to-r from-green-500 to-emerald-600 relative overflow-hidden">
                      <img src={`https://source.unsplash.com/random/300x200?${prod.category_name}`} alt={prod.product_name} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-green-600">
                        PRODUCT
                      </div>
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        {prod.category_name}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{prod.product_name}</h4>
                      <p className="text-xs text-gray-500 mb-2">Used for: {prod.usage_duration}</p>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{prod.pros}</p>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-xs font-semibold text-green-600">🛍️ Product</span>
                        <span className="text-xs text-gray-400">Review</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show empty state if no content */}
                {(filterType === 'All' && experiences.length === 0 && products.length === 0) || 
                 (filterType === 'Experiences' && experiences.length === 0) || 
                 (filterType === 'Products' && products.length === 0) ? (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-400 mb-4">No {filterType.toLowerCase()} shared yet</p>
                    <button className="bg-brand-blue text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
                      + Add {filterType === 'Experiences' ? 'Experience' : 'Product'}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
      </div>
      </div>

      {selectedExperienceId && (
        <ExperienceDetails 
          experience={experiences.find(e => e.id === selectedExperienceId)}
          onClose={() => setSelectedExperienceId(null)}
        />
      )}
    </div>
  );
};

// --- MAIN APP ---

function App() {
  const { user, logout } = useAuth();
  
  console.log('App render - user:', user);
  const [activePage, setActivePage] = useState('Experiences');
  const [showNewExperience, setShowNewExperience] = useState(false);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedProductForExperience, setSelectedProductForExperience] = useState(null);

  const handleAddExperience = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setSelectedProductForExperience(null);
    setShowNewExperience(true);
  };

  const handleAddProduct = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setShowNewProduct(true);
  };

  const handleAddProductExperience = (product) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setSelectedProductForExperience(product);
    setShowNewExperience(true);
  };

  const handleAvatarClick = () => {
    if (user) {
      // If logged in, go to profile
      setActivePage('Profile');
    } else {
      // If not logged in, show login modal
      setShowLogin(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleExperienceSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProductSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage}
        onAddExperience={handleAddExperience}
        onAddProduct={handleAddProduct}
        onAvatarClick={handleAvatarClick}
        onNotificationClick={handleNotificationClick}
        user={user}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto">
        {activePage === 'Experiences' && <ExperiencesPage refreshTrigger={refreshTrigger} />}
        {activePage === 'Profile' && <ProfilePage user={user} onLoginClick={() => setShowLogin(true)} />}
        {activePage === 'Dashboard' && (
          <DashboardPage
            user={user}
            onLoginClick={() => setShowLogin(true)}
            onOpenNotifications={() => setShowNotifications(true)}
          />
        )}
        {activePage === 'Products' && <ProductsPage refreshTrigger={refreshTrigger} onAddExperience={handleAddProductExperience} user={user} />}
      </main>
      
      {showNewExperience && (
        <NewExperience 
          onClose={() => {
            setShowNewExperience(false);
            setSelectedProductForExperience(null);
          }}
          onSuccess={handleExperienceSuccess}
          productName={selectedProductForExperience?.product_name}
          initialCategoryName={selectedProductForExperience?.category_name}
          initialTitle={selectedProductForExperience ? `My experience with this product` : ''}
          productId={selectedProductForExperience?.id}
        />
      )}

      {showNewProduct && (
        <NewProduct 
          onClose={() => setShowNewProduct(false)}
          onSuccess={handleProductSuccess}
        />
      )}

      {showLogin && (
        <LoginPage 
          onClose={() => setShowLogin(false)}
        />
      )}

      {showNotifications && (
        <NotificationsPanel
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}

export default App;