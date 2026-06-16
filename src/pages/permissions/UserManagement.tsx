import { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Shield,
  Building2,
  Phone,
  X,
} from 'lucide-react';
import { useUserStore, useUiStore, useOrgStore } from '@/store';

export default function UserManagement() {
  const { users, loading, fetchUsers, addUser, updateUser, deleteUser } = useUserStore();
  const { setCurrentPageTitle } = useUiStore();
  const { orgList, fetchOrgTree } = useOrgStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    realName: '',
    phone: '',
    email: '',
    roleId: '',
    orgId: '',
    status: 'active',
  });

  useEffect(() => {
    setCurrentPageTitle('用户管理');
    fetchUsers();
    fetchOrgTree();
  }, [setCurrentPageTitle, fetchUsers, fetchOrgTree]);

  const filteredUsers = users.filter(
    (u) =>
      u.realName.includes(searchKeyword) ||
      u.username.includes(searchKeyword) ||
      u.phone.includes(searchKeyword)
  );

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      realName: '',
      phone: '',
      email: '',
      roleId: '',
      orgId: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      realName: user.realName,
      phone: user.phone,
      email: user.email || '',
      roleId: user.roleId,
      orgId: user.orgId,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该用户吗？')) {
      deleteUser(id);
    }
  };

  const handleSubmit = () => {
    if (editingUser) {
      updateUser({ ...editingUser, ...formData });
    } else {
      addUser({
        id: `user-${Date.now()}`,
        ...formData,
        status: formData.status as 'active' | 'disabled',
        roleName: formData.roleId === 'role-001' ? '超级管理员' : formData.roleId === 'role-002' ? '市级值班员' : '区级值班员',
        orgName: orgList.find(o => o.id === formData.orgId)?.name || '',
        createTime: new Date().toLocaleString(),
      });
    }
    setShowModal(false);
  };

  const roles = [
    { id: 'role-001', name: '超级管理员' },
    { id: 'role-002', name: '市级值班员' },
    { id: 'role-003', name: '区级值班员' },
    { id: 'role-004', name: '街道操作员' },
    { id: 'role-005', name: '重点单位操作员' },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="搜索用户姓名、账号、手机号..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-72 h-9 pl-10 pr-4 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
            />
          </div>
          <select className="h-9 px-3 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-primary-500/50">
            <option value="">全部角色</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <select className="h-9 px-3 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-primary-500/50">
            <option value="">全部状态</option>
            <option value="active">启用</option>
            <option value="disabled">禁用</option>
          </select>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2 h-9 text-sm">
          <Plus size={16} />
          新增用户
        </button>
      </div>

      <div className="flex-1 glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="table-header sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-medium">用户信息</th>
              <th className="px-4 py-3 text-left font-medium">账号</th>
              <th className="px-4 py-3 text-left font-medium">角色</th>
              <th className="px-4 py-3 text-left font-medium">所属组织</th>
              <th className="px-4 py-3 text-left font-medium">手机号</th>
              <th className="px-4 py-3 text-left font-medium">状态</th>
              <th className="px-4 py-3 text-left font-medium">最后登录</th>
              <th className="px-4 py-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="table-row">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                      {user.realName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{user.realName}</p>
                      <p className="text-xs text-gray-500">{user.email || '-'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">{user.username}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-primary-500/20 text-primary-300">
                    {user.roleName}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">{user.orgName}</td>
                <td className="px-4 py-3 text-gray-400">{user.phone}</td>
                <td className="px-4 py-3">
                  <span className={`status-${user.status === 'active' ? 'online' : 'offline'}`}>
                    {user.status === 'active' ? '启用' : '禁用'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {user.lastLoginTime || '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded transition-colors"
                      title="编辑"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1.5 text-gray-400 hover:text-danger-400 hover:bg-danger-500/10 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-[480px] p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? '编辑用户' : '新增用户'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">姓名</label>
                  <input
                    type="text"
                    value={formData.realName}
                    onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                    className="input-field text-sm"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">账号</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-field text-sm"
                    placeholder="请输入账号"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">所属角色</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="">请选择角色</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">所属组织</label>
                <select
                  value={formData.orgId}
                  onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="">请选择组织</option>
                  {orgList.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">手机号</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field text-sm"
                    placeholder="请输入手机号"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">邮箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field text-sm"
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">状态</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({ ...formData, status: 'active' })}
                      className="text-primary-500"
                    />
                    <span className="text-sm text-gray-300">启用</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'disabled'}
                      onChange={() => setFormData({ ...formData, status: 'disabled' })}
                      className="text-primary-500"
                    />
                    <span className="text-sm text-gray-300">禁用</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 btn-secondary text-sm"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 btn-primary text-sm"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
