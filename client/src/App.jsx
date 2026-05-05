import React, { useState, useEffect, useRef } from 'react';
import NewExperience from './NewExperience';
import NotificationBadge from './NotificationBadge';
import NotificationsPanel from './NotificationsPanel';
import LoginPage from './LoginPage';
import NewProduct from './NewProduct';
import ProductsPage from './ProductsPage';
import DashboardPage from './DashboardPage';
import { useAuth } from './AuthContext';
import API_BASE from './config';

// --- BİLEŞENLER (COMPONENTS) ---

// 1. Ortak Navigasyon Barı (image_5.png referanslı)
const Header = ({ activePage, setActivePage, onAddExperience, onAddProduct, onAvatarClick, user, onLogout, onNotificationClick }) => {
  const navLinks = ['Dashboard', 'Experiences', 'Products', 'Profile'];
  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-white border-b border-blue-100 shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg transform hover:scale-110 transition-transform">X</div>
          <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Xplora</span>
        </div>
        
        <div className="flex items-center gap-8">
          {navLinks.map(link => (
            <button 
              key={link} 
              onClick={() => setActivePage(link)}
              className={`pb-2 text-sm font-semibold transition-all duration-200 ${activePage === link ? 'text-transparent bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text border-b-3 border-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <button
                onClick={onAddExperience}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 transform hover:scale-105"
              >
                + NEW EXPERIENCE
              </button>
              <button
                onClick={onAddProduct}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 transform hover:scale-105"
              >
                + NEW PRODUCT
              </button>
            </>
          )}
          {user && (
            <div className="relative">
              <button
                onClick={onNotificationClick}
                className="w-11 h-11 rounded-full border-2 border-blue-200 hover:border-blue-500 transition-all bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center hover:shadow-lg shadow-md"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8c0-3.31-2.69-6-6-6S6 4.69 6 8c0 7-3 8-3 8h18s-3-1-3-8" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <NotificationBadge userId={user.id} />
              </button>
            </div>
          )}
          {user && (
            <div className="relative group">
              <button
                onClick={onAvatarClick}
                className="flex items-center gap-3 px-2 py-1.5 rounded-full border-2 border-blue-300 hover:border-blue-500 transition-all bg-white hover:bg-blue-50 shadow-md hover:shadow-lg"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 border-2 border-white">
                  {!user?.avatar_url ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  ) : (
                    <img src={user.avatar_url} alt="User" className="w-11 h-11 object-cover block" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs text-gray-500 font-semibold">Profile</p>
                  <p className="text-sm font-bold text-slate-900 line-clamp-1">{user.username}</p>
                </div>
              </button>
              {user && (
                <button
                  onClick={onLogout}
                  className="absolute top-14 right-0 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 shadow-xl hover:shadow-2xl transition-all opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

// 2. Experience Details Modal
const ExperienceDetails = ({ experience, onClose }) => {
  if (!experience) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white via-blue-50 to-slate-100 rounded-3xl p-10 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">⭐ Experience Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-4xl font-light transition-colors"
          >
            ×
          </button>
        </div>

        {/* Experience Image */}
        {experience.experience_image && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border-2 border-blue-300">
            <img src={experience.experience_image} alt={experience.title} className="w-full h-96 object-cover" />
          </div>
        )}

        {/* Experience Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border-2 border-blue-300 mb-8 shadow-lg">
          <div className="flex items-start gap-8">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-lg">
              {experience.title.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">⭐ Experience</span>
                <span className="bg-indigo-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">{experience.category_name}</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{experience.title}</h3>
              
              <div className="flex items-center gap-3 mb-4 text-2xl font-black text-yellow-500">
                <span>{'★'.repeat(experience.rating)}{'☆'.repeat(5 - experience.rating)}</span>
                <span className="text-slate-900 ml-2">{experience.rating}/5</span>
              </div>

              {experience.location && (
                <p className="text-slate-800 text-base mb-4 font-bold">📍 Location: <span className="text-blue-700">{experience.location}</span></p>
              )}

              <p className="text-slate-800 text-base leading-relaxed mb-6 font-semibold">{experience.content}</p>

              {experience.username && (
                <div className="flex items-center gap-3 pt-6 border-t-2 border-blue-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {experience.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{experience.username}</p>
                    <p className="text-xs text-slate-600 font-semibold">{new Date(experience.created_at).toLocaleDateString()}</p>
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
  <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-blue-200 group cursor-pointer transform hover:scale-105 hover:-translate-y-2" onClick={onViewDetails}>
    <div className="aspect-16/10 rounded-2xl overflow-hidden mb-6 relative shadow-md">
      <img 
        src={experience.experience_image || `https://source.unsplash.com/random/600x400?${experience.category_name}`} 
        alt={experience.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
      />
      <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg">
        ⭐ EXPERIENCE
      </div>
      <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-black text-blue-600 shadow-lg">
        {'★'.repeat(experience.rating)}{'☆'.repeat(5 - experience.rating)}
      </span>
    </div>
    <span className="text-blue-700 text-[10px] font-black uppercase tracking-[0.2em]">{experience.category_name}</span>
    <h3 className="text-2xl font-black mb-3 mt-2 text-slate-900">{experience.title}</h3>
    <p className="text-slate-700 text-sm leading-relaxed mb-6 line-clamp-3 font-semibold">{experience.content}</p>
    <div className="flex justify-between items-center pt-6 border-t-2 border-blue-200">
      <span className="font-black text-xl text-blue-700 bg-blue-100 px-4 py-2 rounded-full">{experience.rating}/5</span>
      <button className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center hover:shadow-lg text-white font-bold text-lg transition-all shadow-md transform hover:scale-110" onClick={(e) => { e.stopPropagation(); onViewDetails(); }}>
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

  const experienceCategories = ['City', 'Cinema', 'Theatre', 'Workshop'];

  const fetchExperiences = () => {
    fetch('/api/experiences')
      .then(res => res.json())
      .then(data => {
        // Filter to only include actual experiences (with valid experience categories)
        const filteredExperiences = data.filter(exp => 
          experienceCategories.includes(exp.category_name)
        );
        setExperiences(filteredExperiences);
      })
      .catch(err => console.error("Data loading error:", err));
  };

  const fetchCategories = () => {
    // Hardcoded categories to match the add experience form
    setCategories(['All', ...experienceCategories]);
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
      <div className="p-12 min-h-screen">
        <header className="mb-16">
          <span className="text-blue-600 text-xs font-black uppercase tracking-[0.3em]">⭐ Personal Experiences</span>
          <h1 className="text-5xl font-black mb-4 mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Discover Reality</h1>
          <p className="text-slate-700 text-lg mb-8 font-semibold">Share and explore authentic experiences from around the world</p>
          <div className="flex flex-wrap items-center gap-3 mt-12">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-200 transform hover:scale-105 shadow-md ${
                  filterCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperiences.length > 0 ? filteredExperiences.map((exp) => (
            <ExperienceCard 
              key={exp.id}
              experience={exp}
              onViewDetails={() => setSelectedExperienceId(exp.id)}
            />
          )) : (
            <div className="col-span-full py-16 text-center">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-600 text-lg font-semibold">No experiences found for this category.</p>
            </div>
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

// Helper function to calculate usage duration
const calculateUsageDuration = (purchaseDate) => {
  const purchase = new Date(purchaseDate);
  const today = new Date();
  
  const diffTime = Math.abs(today - purchase);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day';
  if (diffDays < 7) return `${diffDays} days`;
  
  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) return '1 week';
  if (weeks < 4) return `${weeks} weeks`;
  
  const months = Math.floor(diffDays / 30);
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  
  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year' : `${years} years`;
};

// 2. Profile Page
const ProfilePage = ({ user, onLoginClick }) => {
  const [filterType, setFilterType] = useState('All');
  const [experiences, setExperiences] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file?.name, 'Size:', file?.size, 'Type:', file?.type);
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = reader.result;
          console.log('FileReader loaded, base64 length:', base64String.length);

          const response = await fetch(`${API_BASE}/api/users/${user.id}/avatar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ file: base64String })
          });
          console.log('Fetch response status:', response.status);

          if (response.ok) {
            console.log('Upload successful, reloading page');
            // Update the page to show the new avatar
            window.location.reload();
          } else {
            console.log('Upload failed with status:', response.status);
            const errorData = await response.json();
            alert(`Failed to upload: ${errorData.error || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert('Error uploading profile picture: ' + error.message);
        } finally {
          console.log('Setting uploading to false');
          setUploading(false);
          // Reset file input
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        console.error('FileReader error occurred');
        alert('Error reading file');
        setUploading(false);
      };
      console.log('Starting to read file as DataURL');
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File processing error:', error);
      alert('Error processing file');
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    // Fetch all experiences and filter by user
    fetch('/api/experiences')
      .then(res => res.json())
      .then(data => {
        const userExperiences = data.filter(exp => exp.user_id === user.id);
        setExperiences(userExperiences);
      })
      .catch(err => {
        console.error("Data fetch error:", err);
        setExperiences([]);
      });

    // Fetch all products and filter by user
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const userProducts = data.filter(prod => prod.user_id === user.id);
        setProducts(userProducts);
      })
      .catch(err => {
        console.error("Products fetch error:", err);
        setProducts([]);
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
      <div className="relative h-80 bg-gradient-to-r from-brand-blue to-blue-600 rounded-b-3xl overflow-hidden mb-20">
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
          <div className="relative group">
            <button
              onClick={handleProfilePictureClick}
              className="relative w-48 h-48 rounded-full border-4 border-white shadow-2xl hover:opacity-90 transition-opacity group"
              disabled={uploading}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                {!user.avatar_url ? (
                  <svg className="w-32 h-32 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                ) : (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
              {!uploading && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center rounded-full transition-all">
                  <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-10 h-10 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-white text-sm font-semibold">Change Photo</p>
                  </div>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                  <div className="animate-spin">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  </div>
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full p-3 shadow-xl border-4 border-white">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <div className="pb-4">
            <h1 className="text-4xl font-extrabold mb-1">{user.username}</h1>
            <p className="text-gray-600 text-lg mb-3">{user.email}</p>
            <div className="flex gap-3">
              <span className="bg-brand-orange text-white text-xs font-bold px-4 py-2 rounded-full">📍 Member</span>
              <span className="bg-brand-blue text-white text-xs font-bold px-4 py-2 rounded-full">✅ Active User</span>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-semibold">Click on your profile picture to change it</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-brand-orange">{experiences.length}</p>
            <p className="text-gray-600 text-sm mt-2">Experiences Shared</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-brand-blue">{products.length}</p>
            <p className="text-gray-600 text-sm mt-2">Products Reviewed</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{experiences.length + products.length}</p>
            <p className="text-gray-600 text-sm mt-2">Total Contributions</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          {['All', 'Experiences', 'Products'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`pb-3 px-4 font-semibold text-sm transition-colors ${
                filterType === tab
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6">
        {filterType === 'All' || filterType === 'Experiences' ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">My Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map(exp => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  onViewDetails={() => setSelectedExperienceId(exp.id)}
                />
              ))}
            </div>
            {experiences.length === 0 && (
              <p className="text-gray-400 text-center py-8">No experiences shared yet</p>
            )}
          </div>
        ) : null}

        {filterType === 'All' || filterType === 'Products' ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Product Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-green-300 overflow-hidden hover:shadow-lg transition-all hover:border-green-400">
                  {/* Header with Category Badge */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl font-black text-green-600">
                        {product.product_name?.charAt(0).toUpperCase() || '📦'}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{product.product_name}</h3>
                        <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full inline-block mt-1">{product.category_name || 'Product'}</span>
                      </div>
                    </div>
                    {/* Rating Stars */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xl ${i < (product.rating || 0) ? 'text-yellow-300' : 'text-white text-opacity-30'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Product Image */}
                  {product.product_image && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img src={product.product_image} alt={product.product_name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Rating and Usage Duration */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-black text-green-700">{product.rating || 0}</span>
                        <span className="text-gray-600 text-sm ml-2">/ 5 Stars</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Used for:</p>
                        <p className="text-sm font-bold text-green-700">⏱️ {calculateUsageDuration(product.purchase_date)}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">{product.content || product.description || 'No description provided'}</p>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {product.pros && (
                        <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                          <p className="text-green-800 text-xs font-bold mb-1">✅ PROS</p>
                          <p className="text-gray-700 text-xs line-clamp-3">{product.pros}</p>
                        </div>
                      )}
                      {product.cons && (
                        <div className="bg-red-100 rounded-lg p-3 border border-red-300">
                          <p className="text-red-800 text-xs font-bold mb-1">❌ CONS</p>
                          <p className="text-gray-700 text-xs line-clamp-3">{product.cons}</p>
                        </div>
                      )}
                    </div>

                    {/* Review Date */}
                    <div className="pt-4 border-t border-green-300">
                      <span className="text-xs text-gray-600">
                        📅 Reviewed on {new Date(product.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products.length === 0 && (
              <p className="text-gray-400 text-center py-8">No product reviews yet</p>
            )}
          </div>
        ) : null}
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

// 3. Notifications Component
const NotificationsPage = ({ user, onLoginClick, onOpenNotifications }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/api/notifications?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error("Notifications fetch error:", err));
  }, [user]);

  if (!user) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-400 mb-4">Please log in to view notifications</p>
        <button 
          onClick={onLoginClick}
          className="bg-brand-blue text-white px-6 py-2 rounded-full text-sm font-semibold"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Notifications</h1>
      <div className="max-w-2xl space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No notifications yet</p>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-gray-800">{notification.message}</p>
              <span className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- MAIN APP ---

function App() {
  const { user, logout } = useAuth();
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
