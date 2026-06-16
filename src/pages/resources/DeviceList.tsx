import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Video,
  MoreHorizontal,
  Eye,
  Settings,
  Download,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react';
import { useDeviceStore, useOrgStore, useUiStore } from '@/store';
import OrgTree from '@/components/OrgTree';
import type { Organization } from '@/types';

export default function DeviceList() {
  const {
    devices,
    loading,
    searchKeyword,
    statusFilter,
    orgFilter,
    fetchDevices,
    setSearchKeyword,
    setStatusFilter,
    setOrgFilter,
    getFilteredDevices,
    getDeviceCount,
    setSelectedDevice,
  } = useDeviceStore();
  const { fetchOrgTree, orgList, selectedOrgId, setSelectedOrg } = useOrgStore();
  const { setCurrentPageTitle } = useUiStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showOrgPanel, setShowOrgPanel] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    setCurrentPageTitle('视频资源管理');
    fetchDevices();
    fetchOrgTree();
  }, [setCurrentPageTitle, fetchDevices, fetchOrgTree]);

  useEffect(() => {
    setOrgFilter(selectedOrgId);
    setCurrentPage(1);
  }, [selectedOrgId, setOrgFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, statusFilter, orgFilter]);

  const filteredDevices = getFilteredDevices();
  const totalPages = Math.ceil(filteredDevices.length / pageSize);
  const currentDevices = filteredDevices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const stats = getDeviceCount();

  const handleOrgSelect = (org: Organization) => {
    if (org.id === selectedOrgId) {
      setSelectedOrg('');
    }
  };

  const handleClearFilter = () => {
    setSearchKeyword('');
    setStatusFilter('all');
    setSelectedOrg('');
  };

  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: 'online', label: '在线' },
    { value: 'offline', label: '离线' },
    { value: 'warning', label: '告警' },
  ];

  const statusLabel: Record<string, string> = {
    online: '在线',
    offline: '离线',
    warning: '告警',
  };

  const typeLabel: Record<string, string> = {
    camera: '摄像机',
    nvr: '录像机',
    encoder: '编码器',
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">设备总数</p>
          <p className="text-2xl font-bold text-white tabular-nums">{stats.total}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">在线设备</p>
          <p className="text-2xl font-bold text-success-400 tabular-nums">{stats.online}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">离线设备</p>
          <p className="text-2xl font-bold text-gray-400 tabular-nums">{stats.offline}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">告警设备</p>
          <p className="text-2xl font-bold text-warning-400 tabular-nums">{stats.warning}</p>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {showOrgPanel && (
          <div className="w-64 glass-card flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">组织架构</h3>
              <button
                onClick={() => setShowOrgPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                <Filter size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <OrgTree onSelect={handleOrgSelect} showDeviceCount />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showOrgPanel && (
                <button
                  onClick={() => setShowOrgPanel(true)}
                  className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Filter size={18} />
                </button>
              )}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索设备名称、编号..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-64 h-9 pl-10 pr-4 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-9 px-3 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-primary-500/50"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {(searchKeyword || statusFilter !== 'all' || orgFilter) && (
                <button
                  onClick={handleClearFilter}
                  className="h-9 px-3 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-gray-200 transition-colors flex items-center gap-1 text-sm"
                >
                  <X size={14} />
                  清空筛选
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {orgFilter && (
                <span className="text-sm text-gray-400">
                  当前筛选: <span className="text-primary-400">{orgList.find(o => o.id === orgFilter)?.name}</span>
                </span>
              )}
              <button
                onClick={() => fetchDevices()}
                className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
                title="刷新"
              >
                <RefreshCw size={18} />
              </button>
              <button className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors">
                <Download size={18} />
              </button>
              <button className="btn-primary flex items-center gap-2 h-9 text-sm">
                <Plus size={16} />
                添加设备
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="table-header sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">设备名称</th>
                  <th className="px-4 py-3 text-left font-medium">设备编号</th>
                  <th className="px-4 py-3 text-left font-medium">类型</th>
                  <th className="px-4 py-3 text-left font-medium">状态</th>
                  <th className="px-4 py-3 text-left font-medium">所属组织</th>
                  <th className="px-4 py-3 text-left font-medium">IP地址</th>
                  <th className="px-4 py-3 text-left font-medium">最后在线</th>
                  <th className="px-4 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {currentDevices.map((device) => (
                  <tr key={device.id} className="table-row">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Video size={16} className="text-primary-400" />
                        <span className="text-gray-200">{device.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {device.code}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {typeLabel[device.type] || device.type}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`status-${device.status}`}>
                        {statusLabel[device.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {orgList.find((o) => o.id === device.orgId)?.name || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {device.ip}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {device.lastOnlineTime}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedDevice(device)}
                          className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded transition-colors"
                          title="预览"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded transition-colors"
                          title="配置"
                        >
                          <Settings size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {currentDevices.length === 0 && (
              <div className="py-20 text-center">
                <Video size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500">暂无设备数据</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              共 {filteredDevices.length} 条记录
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm bg-white/10 text-gray-300 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    page = currentPage - 2 + i;
                  }
                  if (currentPage > totalPages - 2) {
                    page = totalPages - 4 + i;
                  }
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm rounded transition-colors ${
                      currentPage === page
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm bg-white/10 text-gray-300 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
