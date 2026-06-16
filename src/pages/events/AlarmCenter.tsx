import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowRight,
  X,
  User,
  Building2,
  Calendar,
  ChevronRight,
  Video,
} from 'lucide-react';
import { useAlarmStore, useUiStore } from '@/store';

const levelConfig = {
  critical: { label: '紧急', color: 'bg-danger-500/20 text-danger-300 border-danger-500/30' },
  major: { label: '重要', color: 'bg-warning-500/20 text-warning-300 border-warning-500/30' },
  minor: { label: '一般', color: 'bg-primary-500/20 text-primary-300 border-primary-500/30' },
  tip: { label: '提示', color: 'bg-success-500/20 text-success-300 border-success-500/30' },
};

const statusConfig = {
  pending: { label: '待处理', icon: Clock, color: 'text-warning-400', bg: 'bg-warning-500/10' },
  processing: { label: '处理中', icon: AlertTriangle, color: 'text-primary-400', bg: 'bg-primary-500/10' },
  dispatched: { label: '已分派', icon: ArrowRight, color: 'text-success-400', bg: 'bg-success-500/10' },
  closed: { label: '已关闭', icon: CheckCircle, color: 'text-gray-500', bg: 'bg-gray-500/10' },
};

const typeConfig: Record<string, string> = {
  intrusion: '入侵告警',
  fire: '消防告警',
  offline: '离线告警',
  fault: '故障告警',
  other: '其他告警',
};

export default function AlarmCenter() {
  const {
    alarms,
    selectedAlarm,
    loading,
    levelFilter,
    statusFilter,
    fetchAlarms,
    setLevelFilter,
    setStatusFilter,
    setSelectedAlarm,
    getFilteredAlarms,
    getAlarmStats,
    confirmAlarm,
    dispatchAlarm,
    closeAlarm,
  } = useAlarmStore();
  const { setCurrentPageTitle } = useUiStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [dispatchModal, setDispatchModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [closeReason, setCloseReason] = useState('');
  const [dispatchForm, setDispatchForm] = useState({
    orgId: '',
    orgName: '',
    handler: '',
    remark: '',
  });
  const pageSize = 10;

  useEffect(() => {
    setCurrentPageTitle('告警中心');
    fetchAlarms();
  }, [setCurrentPageTitle, fetchAlarms]);

  const filteredAlarms = getFilteredAlarms();
  const totalPages = Math.ceil(filteredAlarms.length / pageSize);
  const currentAlarms = filteredAlarms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const stats = getAlarmStats();

  const handleViewDetail = (alarm: typeof alarms[0]) => {
    setSelectedAlarm(alarm);
    setShowDetail(true);
  };

  const handleConfirm = (alarmId: string) => {
    confirmAlarm(alarmId);
    if (showDetail && selectedAlarm?.id === alarmId) {
      setTimeout(() => {
        const updated = alarms.find(a => a.id === alarmId);
        if (updated) {
          setSelectedAlarm(updated);
        }
      }, 0);
    }
  };

  const handleDispatch = (alarm: typeof alarms[0]) => {
    setSelectedAlarm(alarm);
    setDispatchForm({
      orgId: 'org-002',
      orgName: '东城区综治中心',
      handler: '张伟（值班员）',
      remark: '',
    });
    setDispatchModal(true);
  };

  const confirmDispatch = () => {
    if (selectedAlarm && dispatchForm.orgId && dispatchForm.handler) {
      dispatchAlarm(
        selectedAlarm.id,
        dispatchForm.handler,
        dispatchForm.orgName
      );
      setDispatchModal(false);
      if (showDetail && selectedAlarm) {
        const updated = alarms.find(a => a.id === selectedAlarm.id);
        if (updated) {
          setSelectedAlarm(updated);
        }
      }
    }
  };

  const handleClose = (alarm: typeof alarms[0]) => {
    setSelectedAlarm(alarm);
    setCloseModal(true);
  };

  const confirmClose = () => {
    if (selectedAlarm && closeReason) {
      closeAlarm(selectedAlarm.id, closeReason);
      setCloseModal(false);
      setCloseReason('');
      if (showDetail) {
        setTimeout(() => {
          const updated = alarms.find(a => a.id === selectedAlarm.id);
          if (updated) {
            setSelectedAlarm(updated);
          }
        }, 0);
      }
    }
  };

  const levelOptions = [
    { value: 'all', label: '全部等级' },
    { value: 'critical', label: '紧急' },
    { value: 'major', label: '重要' },
    { value: 'minor', label: '一般' },
    { value: 'tip', label: '提示' },
  ];

  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: 'pending', label: '待处理' },
    { value: 'processing', label: '处理中' },
    { value: 'dispatched', label: '已分派' },
    { value: 'closed', label: '已关闭' },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">全部告警</p>
          <p className="text-2xl font-bold text-white tabular-nums">{stats.total}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">待处理</p>
          <p className="text-2xl font-bold text-warning-400 tabular-nums">{stats.pending}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">处理中</p>
          <p className="text-2xl font-bold text-primary-400 tabular-nums">{stats.processing}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">已分派</p>
          <p className="text-2xl font-bold text-success-400 tabular-nums">{stats.dispatched}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">已关闭</p>
          <p className="text-2xl font-bold text-gray-400 tabular-nums">{stats.closed}</p>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索告警..."
                  className="w-64 h-9 pl-10 pr-4 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
              </div>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as any)}
                className="h-9 px-3 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-primary-500/50"
              >
                {levelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary h-9 text-sm flex items-center gap-1">
                <Filter size={16} />
                高级筛选
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="table-header sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">告警等级</th>
                  <th className="px-4 py-3 text-left font-medium">告警标题</th>
                  <th className="px-4 py-3 text-left font-medium">类型</th>
                  <th className="px-4 py-3 text-left font-medium">状态</th>
                  <th className="px-4 py-3 text-left font-medium">设备</th>
                  <th className="px-4 py-3 text-left font-medium">所属组织</th>
                  <th className="px-4 py-3 text-left font-medium">发生时间</th>
                  <th className="px-4 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {currentAlarms.map((alarm) => {
                  const statusInfo = statusConfig[alarm.status];
                  const StatusIcon = statusInfo.icon;
                  return (
                    <tr key={alarm.id} className="table-row">
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${levelConfig[alarm.level].color}`}
                        >
                          {levelConfig[alarm.level].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetail(alarm)}
                          className="text-gray-200 hover:text-primary-400 transition-colors text-left"
                        >
                          {alarm.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {typeConfig[alarm.type]}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 ${statusInfo.color}`}>
                          <StatusIcon size={14} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{alarm.deviceName}</td>
                      <td className="px-4 py-3 text-gray-400">{alarm.orgName}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{alarm.createTime}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {alarm.status === 'pending' && (
                            <button
                              onClick={() => handleConfirm(alarm.id)}
                              className="px-2.5 py-1 text-xs bg-primary-500/20 text-primary-300 rounded hover:bg-primary-500/30 transition-colors"
                            >
                              确认
                            </button>
                          )}
                          {alarm.status === 'processing' && (
                            <button
                              onClick={() => handleDispatch(alarm)}
                              className="px-2.5 py-1 text-xs bg-success-500/20 text-success-300 rounded hover:bg-success-500/30 transition-colors"
                            >
                              分派
                            </button>
                          )}
                          {(alarm.status === 'pending' ||
                            alarm.status === 'processing' ||
                            alarm.status === 'dispatched') && (
                            <button
                              onClick={() => handleClose(alarm)}
                              className="px-2.5 py-1 text-xs bg-gray-500/20 text-gray-300 rounded hover:bg-gray-500/30 transition-colors"
                            >
                              关闭
                            </button>
                          )}
                          <button
                            onClick={() => handleViewDetail(alarm)}
                            className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded transition-colors"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-gray-400">共 {filteredAlarms.length} 条记录</p>
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

        {showDetail && selectedAlarm && (
          <div className="w-96 glass-card flex flex-col overflow-hidden animate-slide-left">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">告警详情</h3>
              <button
                onClick={() => setShowDetail(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium border ${levelConfig[selectedAlarm.level].color}`}
                  >
                    {levelConfig[selectedAlarm.level].label}
                  </span>
                  <span className={`text-sm ${statusConfig[selectedAlarm.status].color}`}>
                    {statusConfig[selectedAlarm.status].label}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-white">{selectedAlarm.title}</h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">告警描述</p>
                    <p className="text-sm text-gray-300 mt-0.5">{selectedAlarm.description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">所属组织</p>
                    <p className="text-sm text-gray-300 mt-0.5">{selectedAlarm.orgName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Video size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">关联设备</p>
                    <p className="text-sm text-gray-300 mt-0.5">{selectedAlarm.deviceName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">发生时间</p>
                    <p className="text-sm text-gray-300 mt-0.5">{selectedAlarm.createTime}</p>
                  </div>
                </div>

                {(selectedAlarm.status === 'dispatched' || selectedAlarm.status === 'closed') && selectedAlarm.handler && (
                  <>
                    <div className="flex items-start gap-3">
                      <Building2 size={16} className="text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">分派单位</p>
                        <p className="text-sm text-gray-300 mt-0.5">{selectedAlarm.handlerOrg}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">处理人</p>
                        <p className="text-sm text-gray-300 mt-0.5">{selectedAlarm.handler}</p>
                      </div>
                    </div>
                    {selectedAlarm.dispatchTime && (
                      <div className="flex items-start gap-3">
                        <Clock size={16} className="text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">分派时间</p>
                          <p className="text-sm text-gray-300 mt-0.5">
                            {new Date(selectedAlarm.dispatchTime).toLocaleString('zh-CN')}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedAlarm.handleResult && (
                  <div className="p-3 bg-success-500/10 rounded-lg">
                    <p className="text-xs text-success-400 mb-1">处理结果</p>
                    <p className="text-sm text-gray-300">{selectedAlarm.handleResult}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-3">处理时间线</p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-warning-500 mt-1.5" />
                    <div>
                      <p className="text-sm text-gray-300">告警产生</p>
                      <p className="text-xs text-gray-500">{selectedAlarm.createTime}</p>
                    </div>
                  </div>
                  {selectedAlarm.confirmTime && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5" />
                      <div>
                        <p className="text-sm text-gray-300">告警确认</p>
                        <p className="text-xs text-gray-500">{selectedAlarm.confirmTime}</p>
                      </div>
                    </div>
                  )}
                  {selectedAlarm.dispatchTime && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-success-500 mt-1.5" />
                      <div>
                        <p className="text-sm text-gray-300">告警分派</p>
                        <p className="text-xs text-gray-500">{selectedAlarm.dispatchTime}</p>
                      </div>
                    </div>
                  )}
                  {selectedAlarm.closeTime && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-500 mt-1.5" />
                      <div>
                        <p className="text-sm text-gray-300">告警关闭</p>
                        <p className="text-xs text-gray-500">{selectedAlarm.closeTime}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              {selectedAlarm.status === 'pending' && (
                <button
                  onClick={() => {
                    handleConfirm(selectedAlarm.id);
                  }}
                  className="flex-1 btn-primary text-sm"
                >
                  确认告警
                </button>
              )}
              {selectedAlarm.status === 'processing' && (
                <button
                  onClick={() => {
                    setDispatchModal(true);
                  }}
                  className="flex-1 btn-success text-sm"
                >
                  分派处理
                </button>
              )}
              {(selectedAlarm.status === 'pending' ||
                selectedAlarm.status === 'processing' ||
                selectedAlarm.status === 'dispatched') && (
                <button
                  onClick={() => setCloseModal(true)}
                  className="flex-1 btn-secondary text-sm"
                >
                  关闭告警
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {dispatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-96 p-5 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">分派告警</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">分派给</label>
                <select
                  className="input-field text-sm"
                  value={dispatchForm.orgId}
                  onChange={(e) => {
                    const options = [
                      { id: 'org-002', name: '东城区综治中心' },
                      { id: 'org-003', name: '西城区综治中心' },
                      { id: 'org-004', name: '南城区综治中心' },
                      { id: 'org-005', name: '北城区综治中心' },
                    ];
                    const org = options.find(o => o.id === e.target.value);
                    setDispatchForm({
                      ...dispatchForm,
                      orgId: e.target.value,
                      orgName: org?.name || '',
                    });
                  }}
                >
                  <option value="org-002">东城区综治中心</option>
                  <option value="org-003">西城区综治中心</option>
                  <option value="org-004">南城区综治中心</option>
                  <option value="org-005">北城区综治中心</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">处理人</label>
                <select
                  className="input-field text-sm"
                  value={dispatchForm.handler}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, handler: e.target.value })}
                >
                  <option value="张伟（值班员）">张伟（值班员）</option>
                  <option value="李娜（值班员）">李娜（值班员）</option>
                  <option value="王强（值班员）">王强（值班员）</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">备注</label>
                <textarea
                  className="input-field text-sm h-20 resize-none"
                  placeholder="请输入备注信息..."
                  value={dispatchForm.remark}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, remark: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDispatchModal(false)}
                className="flex-1 btn-secondary text-sm"
              >
                取消
              </button>
              <button
                onClick={confirmDispatch}
                className="flex-1 btn-primary text-sm"
              >
                确认分派
              </button>
            </div>
          </div>
        </div>
      )}

      {closeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-96 p-5 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">关闭告警</h3>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">关闭原因</label>
              <textarea
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                className="input-field text-sm h-24 resize-none"
                placeholder="请输入关闭原因..."
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setCloseModal(false);
                  setCloseReason('');
                }}
                className="flex-1 btn-secondary text-sm"
              >
                取消
              </button>
              <button
                onClick={confirmClose}
                disabled={!closeReason}
                className="flex-1 btn-primary text-sm"
              >
                确认关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
