import React, { useState } from 'react';
import { GlassCard } from '../../common/GlassCard';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  FileCheck2, 
  MessageSquareText, 
  Briefcase, 
  Megaphone, 
  Clock, 
  ArrowRight,
  Filter
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  category: 'Admissions' | 'Feedback' | 'Career Requests' | 'Leave Requests' | 'Announcements';
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  link: string;
}

interface NotificationCenterWidgetProps {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onToggleRead?: (id: string) => void;
}

export const NotificationCenterWidget: React.FC<NotificationCenterWidgetProps> = ({
  notifications,
  onMarkAllRead,
  onToggleRead,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('All');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const categories = ['All', 'Admissions', 'Feedback', 'Career Requests', 'Announcements'];

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    return n.category === activeTab;
  });

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'Admissions': return { icon: FileCheck2, color: 'text-amber-500 bg-amber-500/10' };
      case 'Feedback': return { icon: MessageSquareText, color: 'text-orange-500 bg-orange-500/10' };
      case 'Career Requests': return { icon: Briefcase, color: 'text-purple-500 bg-purple-500/10' };
      case 'Announcements': return { icon: Megaphone, color: 'text-sky-500 bg-sky-500/10' };
      default: return { icon: Bell, color: 'text-emerald-500 bg-emerald-500/10' };
    }
  };

  return (
    <GlassCard className="p-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Notification Center</h2>
            <p className="text-xs text-muted-foreground">{unreadCount} unread administrative alerts</p>
          </div>
        </div>

        {onMarkAllRead && unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 rounded-xl transition-all border border-white/10"
          >
            <CheckCheck size={14} /> Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto text-xs pb-3 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === cat ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'bg-white/5 text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification items */}
      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const { icon: IconComp, color } = getCategoryIcon(notif.category);
            return (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 group ${
                  notif.isRead
                    ? 'bg-white/5 border-white/10 opacity-75'
                    : 'bg-emerald-500/10 border-emerald-500/30 shadow-sm'
                }`}
              >
                <div
                  className="flex items-start gap-3 flex-1 cursor-pointer"
                  onClick={() => {
                    if (onToggleRead && !notif.isRead) onToggleRead(notif.id);
                    navigate(notif.link);
                  }}
                >
                  <div className={`p-2 rounded-xl ${color} shrink-0 mt-0.5`}>
                    <IconComp size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 text-foreground rounded-md border border-white/10">
                        {notif.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium ml-auto">
                        <Clock size={11} /> {notif.date}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold text-foreground group-hover:text-emerald-500 transition-colors ${!notif.isRead ? 'font-extrabold' : ''}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notif.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-center">
                  <button
                    onClick={() => onToggleRead && onToggleRead(notif.id)}
                    title={notif.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      notif.isRead
                        ? 'text-muted-foreground bg-white/5 border-white/10 hover:text-foreground'
                        : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <CheckCheck size={14} />
                  </button>
                  <button
                    onClick={() => navigate(notif.link)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-white/10 transition-colors"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
};
