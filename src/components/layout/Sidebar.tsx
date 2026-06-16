import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Network,
  AlertTriangle,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCog,
  FileText,
  History,
  MessageSquare,
  Map,
  MonitorPlay,
} from 'lucide-react';
import { useUiStore } from '@/store';
import { useState } from 'react';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '总览驾驶舱',
    icon: <LayoutDashboard size={20} />,
    path: '/dashboard',
  },
  {
    key: 'resources',
    label: '资源接入',
    icon: <Video size={20} />,
    children: [
      { key: 'devices', label: '视频资源', icon: <MonitorPlay size={18} />, path: '/resources/devices' },
    ],
  },
  {
    key: 'cascade',
    label: '级联管理',
    icon: <Network size={20} />,
    children: [
      { key: 'relation', label: '级联关系', icon: <Map size={18} />, path: '/cascade/relation' },
      { key: 'wall', label: '视频上墙', icon: <MonitorPlay size={18} />, path: '/cascade/wall' },
    ],
  },
  {
    key: 'events',
    label: '事件处置',
    icon: <AlertTriangle size={20} />,
    children: [
      { key: 'alarms', label: '告警中心', icon: <AlertTriangle size={18} />, path: '/events/alarms' },
      { key: 'playback', label: '历史回溯', icon: <History size={18} />, path: '/events/playback' },
      { key: 'conference', label: '会商中心', icon: <MessageSquare size={18} />, path: '/events/conference' },
    ],
  },
  {
    key: 'reports',
    label: '统计报表',
    icon: <BarChart3 size={20} />,
    children: [
      { key: 'overview', label: '统计总览', icon: <BarChart3 size={18} />, path: '/reports/overview' },
      { key: 'device-report', label: '设备统计', icon: <Video size={18} />, path: '/reports/device' },
      { key: 'alarm-report', label: '告警统计', icon: <AlertTriangle size={18} />, path: '/reports/alarm' },
    ],
  },
  {
    key: 'permissions',
    label: '权限中心',
    icon: <Shield size={20} />,
    children: [
      { key: 'users', label: '用户管理', icon: <Users size={18} />, path: '/permissions/users' },
      { key: 'roles', label: '角色权限', icon: <UserCog size={18} />, path: '/permissions/roles' },
      { key: 'handover', label: '值班交接', icon: <FileText size={18} />, path: '/permissions/handover' },
      { key: 'audit', label: '操作审计', icon: <FileText size={18} />, path: '/permissions/audit' },
    ],
  },
];

function SidebarMenuItem({ item, collapsed, level = 0 }: { item: MenuItem; collapsed: boolean; level?: number }) {
  const [open, setOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 rounded-lg mx-2 ${
            level > 0 ? 'text-sm' : ''
          }`}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="ml-3 flex-1 text-left truncate">{item.label}</span>
              <ChevronRight
                size={16}
                className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
              />
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="mt-1">
            {item.children!.map((child) => (
              <SidebarMenuItem
                key={child.key}
                item={child}
                collapsed={collapsed}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || '#'}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 mb-1 ${
          level > 0 ? 'text-sm' : ''
        } ${
          isActive
            ? 'bg-gradient-to-r from-primary-500/30 to-primary-600/10 text-white border-l-2 border-primary-400'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
        }`
      }
      style={{ paddingLeft: `${16 + level * 16}px` }}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
    </NavLink>
  );
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <aside
      className={`h-full bg-dark-700/80 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow-primary">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">级联指挥平台</h1>
              <p className="text-xs text-gray-400">市级综治中心</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow-primary">
            <Shield size={22} className="text-white" />
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.key} item={item} collapsed={sidebarCollapsed} />
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}
