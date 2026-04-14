import React, { useState, useEffect } from 'react';

const NotificationBadge = ({ userId = 1 }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = () => {
      fetch(`http://localhost:5000/api/notifications/unread/${userId}`)
        .then(res => res.json())
        .then(data => setUnreadCount(data.unread_count))
        .catch(err => console.error('Bildirim sayısı alınırken hata:', err));
    };

    
    fetchUnreadCount();

    
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  if (unreadCount === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
      {unreadCount > 99 ? '99+' : unreadCount}
    </div>
  );
};

export default NotificationBadge;