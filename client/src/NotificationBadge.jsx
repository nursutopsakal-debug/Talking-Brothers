import React, { useState, useEffect } from 'react';

const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      fetch(`/api/notifications/unread`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setUnreadCount(data.unread_count))
        .catch(err => console.error('Bildirim sayısı alınırken hata:', err));
    };

    
    fetchUnreadCount();

    
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  if (unreadCount === 0) return null;

  return (
    <div className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-black rounded-full min-w-6 h-6 flex items-center justify-center px-1 shadow-lg border-2 border-white animate-pulse">
      {unreadCount > 99 ? '99+' : unreadCount}
    </div>
  );
};

export default NotificationBadge;