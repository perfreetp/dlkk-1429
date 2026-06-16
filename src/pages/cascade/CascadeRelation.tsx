import { useEffect, useState } from 'react';
import { Plus, Settings, Save, Trash2, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useOrgStore, useUiStore } from '@/store';
import OrgTree from '@/components/OrgTree';
import type { Organization } from '@/types';

export default function CascadeRelation() {
  const { orgTree, orgList, fetchOrgTree, selectedOrgId, setSelectedOrg, expandAll, collapseAll, updateOrg, addOrg, deleteOrg } = useOrgStore();
  const { setCurrentPageTitle } = useUiStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>({});
  const [permissions, setPermissions] = useState<boolean[]>([true, true, true, false, false]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', code: '', contact: '', phone: '', address: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setCurrentPageTitle('级联关系配置');
    fetchOrgTree();
  }, [setCurrentPageTitle, fetchOrgTree]);

  const selectedOrg = orgList.find(o => o.id === selectedOrgId);

  useEffect(() => {
    if (selectedOrg) {
      setFormData({ ...selectedOrg });
      setPermissions(selectedOrg.permissions || [true, true, true, false, false]);
    }
  }, [selectedOrgId, orgList]);

  const handleSave = () => {
    if (selectedOrgId && formData.name && formData.code) {
      updateOrg(selectedOrgId, {
        name: formData.name,
        code: formData.code,
        contact: formData.contact || '',
        phone: formData.phone || '',
        address: formData.address || '',
        permissions,
      });
      setEditMode(false);
    }
  };

  const handleAddOrg = () => {
    if (addForm.name) {
      addOrg(selectedOrgId || null, addForm);
      setShowAddModal(false);
      setAddForm({ name: '', code: '', contact: '', phone: '', address: '' });
    }
  };

  const handleDeleteOrg = () => {
    if (selectedOrgId) {
      deleteOrg(selectedOrgId);
      setShowDeleteConfirm(false);
      setEditMode(false);
    }
  };

  return (
    <div className="h-full flex gap-4">
      <div className="w-72 glass-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">组织架构</h3>
            <div className="flex gap-1">
              <button
                onClick={expandAll}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="全部展开"
              >
                <ChevronDown size={16} />
              </button>
              <button
                onClick={collapseAll}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="全部折叠"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="搜索组织..."
              className="w-full h-8 pl-3 pr-3 bg-dark-600/50 border border-white/10 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <OrgTree showDeviceCount />
        </div>
        <div className="p-3 border-t border-white/10">
          <button
            className="w-full btn-primary text-sm flex items-center justify-center gap-1.5"
            onClick={() => {
              setAddForm({ name: '', code: `ORG-${Date.now()}`, contact: '', phone: '', address: '' });
              setShowAddModal(true);
            }}
          >
            <Plus size={16} />
            新增{selectedOrg ? '子' : ''}组织
          </button>
        </div>
      </div>

      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-medium text-white">
              {selectedOrg ? selectedOrg.name : '请选择组织'}
            </h3>
            {selectedOrg && (
              <span className="px-2 py-0.5 rounded text-xs bg-primary-500/20 text-primary-300">
                {selectedOrg.level === 1 ? '市级' : selectedOrg.level === 2 ? '区级' : selectedOrg.level === 3 ? '街道级' : '重点单位'}
              </span>
            )}
          </div>
          {selectedOrg && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (editMode) {
                    setFormData({ ...selectedOrg });
                  }
                  setEditMode(!editMode);
                }}
                className="btn-secondary text-sm flex items-center gap-1.5"
              >
                <Settings size={16} />
                {editMode ? '取消编辑' : '编辑'}
              </button>
              {editMode && (
                <button
                  onClick={handleSave}
                  className="btn-primary text-sm flex items-center gap-1.5"
                >
                  <Save size={16} />
                  保存
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {selectedOrg ? (
            <div className="max-w-2xl space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">组织名称</label>
                  <input
                    type="text"
                    value={editMode ? formData.name || '' : selectedOrg.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editMode}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">组织编码</label>
                  <input
                    type="text"
                    value={editMode ? formData.code || '' : selectedOrg.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    disabled={!editMode}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">组织层级</label>
                  <select disabled className="input-field text-sm bg-dark-700/50">
                    <option value={1}>市级</option>
                    <option value={2}>区级</option>
                    <option value={3}>街道级</option>
                    <option value={4}>重点单位</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">上级组织</label>
                  <input
                    type="text"
                    value={orgList.find(o => o.id === selectedOrg.parentId)?.name || '-'}
                    disabled
                    className="input-field text-sm bg-dark-700/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">联系人</label>
                  <input
                    type="text"
                    value={editMode ? formData.contact || '' : selectedOrg.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    disabled={!editMode}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">联系电话</label>
                  <input
                    type="text"
                    value={editMode ? formData.phone || '' : selectedOrg.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editMode}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">地址</label>
                <input
                  type="text"
                  value={editMode ? formData.address || '' : selectedOrg.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!editMode}
                  className="input-field text-sm"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-white mb-4">资源统计</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-white">{selectedOrg.deviceCount}</p>
                    <p className="text-xs text-gray-400 mt-1">设备总数</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-success-400">{selectedOrg.onlineCount}</p>
                    <p className="text-xs text-gray-400 mt-1">在线设备</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-primary-400">
                      {selectedOrg.deviceCount > 0 ? Math.round(selectedOrg.onlineCount / selectedOrg.deviceCount * 100) : 0}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">在线率</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-white mb-4">级联权限配置</h4>
                <div className="space-y-3">
                  {[
                    { label: '视频查看权限', desc: '允许查看该组织下的视频资源' },
                    { label: '云台控制权限', desc: '允许控制该组织下的云台设备' },
                    { label: '录像回放权限', desc: '允许查看该组织下的历史录像' },
                    { label: '告警接收权限', desc: '接收该组织产生的告警信息' },
                    { label: '语音对讲权限', desc: '允许与该组织进行语音对讲' },
                  ].map((item, index) => (
                    <label
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${editMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white/5'}`}
                    >
                      <input
                        type="checkbox"
                        checked={permissions[index]}
                        onChange={(e) => {
                          if (editMode) {
                            const newPerms = [...permissions];
                            newPerms[index] = e.target.checked;
                            setPermissions(newPerms);
                          }
                        }}
                        disabled={!editMode}
                        className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-dark-700 text-primary-500 focus:ring-primary-500/50"
                      />
                      <div>
                        <p className="text-sm text-gray-200">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {editMode && (
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn-danger text-sm flex items-center gap-1.5"
                  >
                    <Trash2 size={16} />
                    删除组织
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Settings size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500">请从左侧选择组织查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-96 p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                新增{selectedOrg ? '子' : ''}组织
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">组织名称</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  placeholder="请输入组织名称"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">组织编码</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  placeholder="请输入组织编码"
                  value={addForm.code}
                  onChange={(e) => setAddForm({ ...addForm, code: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">联系人</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="联系人"
                    value={addForm.contact}
                    onChange={(e) => setAddForm({ ...addForm, contact: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">联系电话</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="联系电话"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">地址</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  placeholder="地址"
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                />
              </div>
              {selectedOrg && (
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">上级组织</label>
                  <input
                    type="text"
                    className="input-field text-sm bg-dark-700/50"
                    value={selectedOrg.name}
                    disabled
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary text-sm"
              >
                取消
              </button>
              <button
                onClick={handleAddOrg}
                disabled={!addForm.name}
                className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认新增
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-96 p-5 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-3">确认删除</h3>
            <p className="text-sm text-gray-400 mb-6">
              确定要删除组织「{selectedOrg?.name}」吗？该操作将同时删除其下所有子组织，且不可恢复。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary text-sm"
              >
                取消
              </button>
              <button
                onClick={handleDeleteOrg}
                className="flex-1 btn-danger text-sm"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
