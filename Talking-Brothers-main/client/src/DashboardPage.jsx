import React, { useEffect, useMemo, useState } from 'react';
import { fetchCategoriesFromApi } from './categoryService';

const API_BASE = 'http://localhost:5000';

const DashboardPage = ({ user, onLoginClick, onOpenNotifications }) => {
  const [categories, setCategories] = useState([]);
  const [followedIds, setFollowedIds] = useState(new Set());
  const [updates, setUpdates] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingCategoryId, setSavingCategoryId] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const followedCategories = useMemo(
    () => categories.filter((category) => followedIds.has(category.id)),
    [categories, followedIds]
  );

  const categoryUpdateCounts = useMemo(() => {
    const counts = new Map();
    updates.forEach((update) => {
      counts.set(update.category_id, (counts.get(update.category_id) || 0) + 1);
    });
    return counts;
  }, [updates]);

  const loadDashboard = async () => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [categoriesData, followedRes, updatesRes, unreadRes] = await Promise.all([
        fetchCategoriesFromApi(),
        fetch(`${API_BASE}/api/categories/followed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE}/api/dashboard/followed-updates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE}/api/notifications/unread/${user.id}`),
      ]);

      if (!followedRes.ok || !updatesRes.ok || !unreadRes.ok) {
        throw new Error('Unable to load dashboard data');
      }

      const [followedData, updatesData, unreadData] = await Promise.all([
        followedRes.json(),
        updatesRes.json(),
        unreadRes.json(),
      ]);

      setCategories(categoriesData);
      setFollowedIds(new Set(followedData.map((item) => item.id)));
      setUpdates(updatesData);
      setUnreadCount(unreadData.unread_count || 0);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const toggleFollow = async (categoryId) => {
    if (!user || !token) {
      onLoginClick();
      return;
    }

    const isFollowed = followedIds.has(categoryId);
    setSavingCategoryId(categoryId);

    try {
      const res = await fetch(`${API_BASE}/api/categories/${categoryId}/follow`, {
        method: isFollowed ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Unable to update follow status');
      }

      const nextFollowed = new Set(followedIds);
      if (isFollowed) {
        nextFollowed.delete(categoryId);
      } else {
        nextFollowed.add(categoryId);
      }
      setFollowedIds(nextFollowed);

      const updatesRes = await fetch(`${API_BASE}/api/dashboard/followed-updates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (updatesRes.ok) {
        const updatesData = await updatesRes.json();
        setUpdates(updatesData);
      }
    } catch (err) {
      console.error('Follow toggle error:', err);
      setError(err.message || 'Unable to update follow status');
    } finally {
      setSavingCategoryId(null);
    }
  };

  if (!user) {
    return (
      <div className="p-12">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500 mb-4">Log in to follow categories and get notifications for new entries.</p>
          <button
            onClick={onLoginClick}
            className="rounded-full bg-brand-blue px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Login to Start Following
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-8">
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-6 shadow-sm lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-800">Category Follow Hub</h1>
          <p className="mt-3 text-sm text-gray-600">
            Follow categories to receive updates in your notification button whenever a new experience or product is posted.
          </p>
        </div>

        <div className="rounded-3xl border border-orange-100 bg-linear-to-br from-orange-50 to-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Notification Summary</p>
          <p className="mt-3 text-4xl font-black text-gray-900">{unreadCount}</p>
          <p className="mt-1 text-sm text-gray-600">Unread category updates</p>
          <button
            onClick={onOpenNotifications}
            className="mt-4 rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Open Notifications
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Discover Categories</h2>
            <span className="text-xs uppercase tracking-[0.16em] text-gray-400">Tap to follow</span>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const followed = followedIds.has(category.id);
                const busy = savingCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleFollow(category.id)}
                    disabled={busy}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      followed
                        ? 'border-brand-blue bg-brand-blue text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-brand-blue hover:text-brand-blue'
                    } ${busy ? 'opacity-60' : ''}`}
                  >
                    {followed ? 'Following' : 'Follow'} {category.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Followed Categories</h2>
          {followedCategories.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">You are not following any category yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {followedCategories.map((category) => (
                <div key={category.id} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-800">{category.name}</p>
                  <p className="text-xs text-gray-500">
                    {categoryUpdateCounts.get(category.id) || 0} recent updates
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">New In Your Followed Categories</h2>
          <span className="text-xs uppercase tracking-[0.16em] text-gray-400">Latest 50</span>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading updates...</p>
        ) : updates.length === 0 ? (
          <p className="text-sm text-gray-500">No updates yet. Follow more categories to populate this feed.</p>
        ) : (
          <div className="space-y-3">
            {updates.map((item) => (
              <div key={`${item.entry_type}-${item.entry_id}`} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.entry_title}</p>
                    <p className="text-xs text-gray-500">
                      {item.entry_type === 'experience' ? 'Experience' : 'Product'} in {item.category_name} by {item.author_name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
