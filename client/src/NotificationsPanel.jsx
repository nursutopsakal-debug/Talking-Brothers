import React, { useEffect, useState } from 'react';

const NotificationsPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const loadNotifications = async () => {
    if (!token) {
      setError('Please log in to view notifications');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Unable to load notifications');
      }

      const data = await res.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error('Notifications load error:', err);
      setError(err.message || 'Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        loadNotifications();
      }
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const renderMessage = (notification) => {
    if (notification.type === 'new_product') {
      return 'A new product was added in a category you follow.';
    }
    if (notification.type === 'new_experience') {
      return 'A new experience was added in a category you follow.';
    }
    return 'There is a new update for one of your followed categories.';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4">
      <div className="mt-20 w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold">Notifications</h2>
            <p className="text-sm text-gray-500">Updates from categories you follow</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading notifications...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500">No new notifications yet.</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-3xl border p-4 ${notification.is_read ? 'border-gray-200 bg-gray-50' : 'border-brand-blue bg-blue-50'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-900">{renderMessage(notification)}</p>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                      {notification.is_read ? 'Read' : 'New'}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
