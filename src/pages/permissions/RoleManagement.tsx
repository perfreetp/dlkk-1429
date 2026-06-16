import { useEffect, useState } from 'react';
import { useUiStore } from '@/store';
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Settings,
  Users,
  Video,
  AlertTriangle,
  BarChart3,
  Network,
} from 'lucide-react';
import { roles as mockRoles } from '@/mock';

export default function RoleManagement() {
  const { setCurrentPageTitle } = useUiStore();
  const [roles, setRoles] = useState(mockRoles);
  const [selectedRole, setSelectedRole] = useState(mockRoles[1]);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard', 'resources', 'cascade', 'events', 'reports', 'permissions']);

  useEffect(() => {
    setCurrentPageTitle('角色权限');
  }, [setCurrentPageTitle]);

  const menuTree = [
    {
      key: 'dashboard',
      label: '总览驾驶舱',
      icon: <BarChart3 size={16} />,
      permissions: ['view'],
    },
    {
      key: 'resources',
      label: '资源接入',
      icon: <Video size={16} />,
      children: [
        { key: 'devices', label: '视频资源', permissions: ['view', 'add', 'edit', 'delete', 'control'] },
        { key: 'groups', label: '设备分组', permissions: ['view', 'add', 'edit', 'delete'] },
      ],
    },
    {
      key: 'cascade',
      label: '级联管理',
      icon: <Network size={16} />,
      children: [
        { key: 'relation', label: '级联关系', permissions: ['view', 'edit'] },
        { key: 'wall', label: '视频上墙', permissions: ['view', 'control'] },
      ],
    },
    {
      key: 'events',
      label: '事件处置',
      icon: <AlertTriangle size={16} />,
      children: [
        { key: 'alarms', label: '告警中心', permissions: ['view', 'confirm', 'dispatch', 'close'] },
        { key: 'playback', label: '历史回溯', permissions: ['view', 'download'] },
        { key: 'conference', label: '会商中心', permissions: ['view', 'create', 'join'] },
      ],
    },
    {
      key: 'reports',
      label: '统计报表',
      icon: <BarChart3 size={16} />,
      children: [
        { key: 'overview', label: '统计总览', permissions: ['view'] },
        { key: 'device-report', label: '设备统计', permissions: ['view', 'export'] },
        { key: 'alarm-report', label: '告警统计', permissions: ['view', 'export'] },
      ],
    },
    {
      key: 'permissions',
      label: '权限中心',
      icon: <Shield size={16} />,
      children: [
        { key: 'users', label: '用户管理', permissions: ['view', 'add', 'edit', 'delete'] },
        { key: 'roles', label: '角色权限', permissions: ['view', 'add', 'edit', 'delete'] },
        { key: 'handover', label: '值班交接', permissions: ['view', 'create'] },
        { key: 'audit', label: '操作审计', permissions: ['view', 'export'] },
      ],
    },
  ];

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const allPermissions = selectedRole?.permissions || [];
  const hasPermission = (perm: string) => allPermissions.includes(perm) || allPermissions.includes('*');

  return (
    <div className="h-full flex gap-4">
      <div className="w-64 glass-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">角色列表</h3>
          <button className="p-1.5 bg-primary-500/20 text-primary-400 rounded hover:bg-primary-500/30 transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedRole?.id === role.id
                  ? 'bg-primary-500/20 border border-primary-500/30'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className={selectedRole?.id === role.id ? 'text-primary-400' : 'text-gray-500'} />
                <span className="text-sm text-gray-200 font-medium">{role.name}</span>
              </div>
              <p className="text-xs text-gray-500 ml-6">{role.code}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-white">
              {selectedRole?.name || '请选择角色'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{selectedRole?.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5">
              <Edit size={14} />
              编辑角色
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedRole ? (
            <div className="space-y-2">
              {menuTree.map((menu) => (
                <div key={menu.key} className="glass-card p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMenu(menu.key)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-primary-400">{menu.icon}</span>
                      <span className="text-sm font-medium text-white">{menu.label}</span>
                    </div>
                    {menu.children && (
                      expandedMenus.includes(menu.key) ? (
                        <ChevronDown size={16} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-500" />
                      )
                    )}
                  </div>

                  {menu.children && expandedMenus.includes(menu.key) && (
                    <div className="mt-3 space-y-3">
                      {menu.children.map((child) => (
                        <div
                          key={child.key}
                          className="pl-6 pr-2 py-2 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-300">{child.label}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {child.permissions.map((perm) => (
                              <label
                                key={perm}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${
                                  hasPermission(perm)
                                    ? 'bg-primary-500/20 text-primary-300'
                                    : 'bg-white/5 text-gray-500'
                                }`}
                              >
                                {hasPermission(perm) ? (
                                  <Check size={12} />
                                ) : (
                                  <div className="w-3 h-3" />
                                )}
                                <span>
                                  {perm === 'view'
                                    ? '查看'
                                    : perm === 'add'
                                    ? '新增'
                                    : perm === 'edit'
                                    ? '编辑'
                                    : perm === 'delete'
                                    ? '删除'
                                    : perm === 'control'
                                    ? '控制'
                                    : perm === 'confirm'
                                    ? '确认'
                                    : perm === 'dispatch'
                                    ? '分派'
                                    : perm === 'close'
                                    ? '关闭'
                                    : perm === 'export'
                                    ? '导出'
                                    : perm === 'download'
                                    ? '下载'
                                    : perm === 'create'
                                    ? '创建'
                                    : perm === 'join'
                                    ? '加入'
                                    : perm}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Shield size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500">请从左侧选择角色查看权限</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
