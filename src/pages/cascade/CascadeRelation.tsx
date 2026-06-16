import { useEffect, useState } from 'react';
import { Plus, Settings, Save, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useOrgStore, useUiStore } from '@/store';
import OrgTree from '@/components/OrgTree';

export default function CascadeRelation() {
  const { orgTree, orgList, fetchOrgTree, selectedOrgId, setSelectedOrg, expandAll, collapseAll } = useOrgStore();
  const { setCurrentPageTitle } = useUiStore();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setCurrentPageTitle('级联关系配置');
    fetchOrgTree();
  }, [setCurrentPageTitle, fetchOrgTree]);

  const selectedOrg = orgList.find(o => o.id === selectedOrgId);

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
          <button className="w-full btn-primary text-sm flex items-center justify-center gap-1.5">
            <Plus size={16} />
            新增组织
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
                onClick={() => setEditMode(!editMode)}
                className="btn-secondary text-sm flex items-center gap-1.5"
              >
                <Settings size={16} />
                {editMode ? '取消编辑' : '编辑'}
              </button>
              {editMode && (
                <button className="btn-primary text-sm flex items-center gap-1.5">
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
                    value={selectedOrg.name}
                    disabled={!editMode}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">组织编码</label>
                  <input
                    type="text"
                    value={selectedOrg.code}
                    disabled={!editMode}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">组织层级</label>
                  <select disabled={!editMode} className="input-field text-sm">
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
                    value={selectedOrg.contact}
                    disabled={!editMode}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">联系电话</label>
                  <input
                    type="text"
                    value={selectedOrg.phone}
                    disabled={!editMode}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">地址</label>
                <input
                  type="text"
                  value={selectedOrg.address}
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
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={index < 3}
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
                  <button className="btn-danger text-sm flex items-center gap-1.5">
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
    </div>
  );
}
