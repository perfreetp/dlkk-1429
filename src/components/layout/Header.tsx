import { Bell, User, Clock, Calendar, Search, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUiStore, useAlarmStore, useUserStore } from '@/store';

export default function Header() {
  const { currentPageTitle, toggleAlarmPanel, showAlarmPanel } = useUiStore();
  const { getAlarmStats, fetchAlarms } = useAlarmStore();
  const { currentUser, fetchUsers } = useUserStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAlarms();
    fetchUsers();
  }, [fetchAlarms, fetchUsers]);

  const stats = getAlarmStats();
  const pendingCount = stats.pending + stats.processing;

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    return `${year}年${month}月${day}日 ${week}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <header className="h-16 bg-dark-700/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white">{currentPageTitle}</h2>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="搜索设备、告警..."
            className="w-64 h-9 pl-10 pr-4 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={16} />
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-primary-300 font-mono text-lg">
            <Clock size={18} />
            <span className="tabular-nums">{formatTime(currentTime)}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10" />

        <button
          onClick={toggleAlarmPanel}
          className={`relative p-2 rounded-lg transition-colors ${
            showAlarmPanel
              ? 'bg-primary-500/20 text-primary-300'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Bell size={20} />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <Settings size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1 pr-3 hover:bg-white/5 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">{currentUser?.realName || '管理员'}</p>
              <p className="text-xs text-gray-500">{currentUser?.roleName || '超级管理员'}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-card py-2 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">{currentUser?.realName}</p>
                <p className="text-xs text-gray-400">{currentUser?.orgName}</p>
              </div>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
                <User size={16} />
                个人信息
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
                <Settings size={16} />
                系统设置
              </button>
              <div className="my-1 border-t border-white/10" />
              <button className="w-full px-4 py-2 text-left text-sm text-danger-400 hover:bg-danger-500/10 transition-colors flex items-center gap-2">
                <LogOut size={16} />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
