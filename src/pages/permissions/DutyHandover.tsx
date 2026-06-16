import { useEffect, useState } from 'react';
import { useUiStore, useUserStore } from '@/store';
import {
  FileText,
  Clock,
  User,
  Plus,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { handoverRecords } from '@/mock';

export default function DutyHandover() {
  const { setCurrentPageTitle } = useUiStore();
  const { users, fetchUsers, currentUser } = useUserStore();
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState(handoverRecords);
  const [formData, setFormData] = useState({
    shiftType: 'day' as 'day' | 'night',
    onDutyUserId: '',
    pendingMatters: '',
    importantEvents: '',
    remarks: '',
  });

  useEffect(() => {
    setCurrentPageTitle('值班交接');
    fetchUsers();
  }, [setCurrentPageTitle, fetchUsers]);

  const handleSubmit = () => {
    const newRecord = {
      id: `handover-${Date.now()}`,
      shiftType: formData.shiftType,
      onDutyUserId: formData.onDutyUserId,
      onDutyUserName: users.find(u => u.id === formData.onDutyUserId)?.realName || '',
      offDutyUserId: currentUser?.id || '',
      offDutyUserName: currentUser?.realName || '',
      handoverTime: new Date().toLocaleString(),
      pendingMatters: formData.pendingMatters,
      importantEvents: formData.importantEvents,
      remarks: formData.remarks,
      status: 'completed' as const,
    };
    setRecords([newRecord, ...records]);
    setShowModal(false);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">班次类型:</span>
            <div className="flex bg-dark-700 rounded-lg p-1">
              <button className="px-3 py-1 text-sm rounded-md bg-primary-500/30 text-white">
                全部
              </button>
              <button className="px-3 py-1 text-sm rounded-md text-gray-400 hover:text-white">
                白班
              </button>
              <button className="px-3 py-1 text-sm rounded-md text-gray-400 hover:text-white">
                夜班
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          交接登记
        </button>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
        <div className="col-span-2 glass-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-base font-medium text-white">交接记录</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="glass-card-hover p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      record.shiftType === 'day'
                        ? 'bg-warning-500/20 text-warning-400'
                        : 'bg-primary-500/20 text-primary-400'
                    }`}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {record.shiftType === 'day' ? '白班交接' : '夜班交接'}
                      </h4>
                      <p className="text-xs text-gray-500">{record.handoverTime}</p>
                    </div>
                  </div>
                  <span className="status-online text-xs">
                    已完成
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">交班人</p>
                    <p className="text-sm text-gray-300">{record.offDutyUserName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">接班人</p>
                    <p className="text-sm text-gray-300">{record.onDutyUserName}</p>
                  </div>
                </div>

                {record.pendingMatters && (
                  <div className="pt-3 border-t border-white/5">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={14} className="text-warning-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">待办事项</p>
                        <p className="text-sm text-gray-300 whitespace-pre-line">
                          {record.pendingMatters}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {record.importantEvents && (
                  <div className="pt-3 border-t border-white/5 mt-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-success-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">重要事项</p>
                        <p className="text-sm text-gray-300 whitespace-pre-line">
                          {record.importantEvents}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-base font-medium text-white">今日值班</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-warning-400 animate-pulse" />
                <span className="text-sm text-warning-400">当前值班</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-medium">
                  张
                </div>
                <div>
                  <p className="text-base font-medium text-white">张建国</p>
                  <p className="text-xs text-gray-400">市级值班员</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-xs text-gray-500">值班时间</p>
                <p className="text-sm text-gray-300">08:30 - 20:30</p>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-gray-500" />
                <span className="text-sm text-gray-400">下一值班</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white text-lg font-medium">
                  李
                </div>
                <div>
                  <p className="text-base font-medium text-white">李美玲</p>
                  <p className="text-xs text-gray-400">市级值班员</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-xs text-gray-500">值班时间</p>
                <p className="text-sm text-gray-300">20:30 - 次日08:30</p>
              </div>
            </div>

            <div className="glass-card p-4">
              <h4 className="text-sm font-medium text-white mb-3">值班提醒</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5" />
                  <span>请按时完成交接班记录</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning-400 mt-1.5" />
                  <span>待处置告警 5 起，请及时处理</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-400 mt-1.5" />
                  <span>设备在线率 95.2%，运行正常</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-[520px] p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">值班交接</h3>
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
                  <label className="text-sm text-gray-400 mb-1.5 block">班次类型</label>
                  <select
                    value={formData.shiftType}
                    onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as any })}
                    className="input-field text-sm"
                  >
                    <option value="day">白班</option>
                    <option value="night">夜班</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">接班人</label>
                  <select
                    value={formData.onDutyUserId}
                    onChange={(e) => setFormData({ ...formData, onDutyUserId: e.target.value })}
                    className="input-field text-sm"
                  >
                    <option value="">请选择接班人</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.realName} - {u.roleName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">待办事项</label>
                <textarea
                  value={formData.pendingMatters}
                  onChange={(e) => setFormData({ ...formData, pendingMatters: e.target.value })}
                  className="input-field text-sm h-20 resize-none"
                  placeholder="请输入待办事项..."
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">重要事项</label>
                <textarea
                  value={formData.importantEvents}
                  onChange={(e) => setFormData({ ...formData, importantEvents: e.target.value })}
                  className="input-field text-sm h-20 resize-none"
                  placeholder="请输入重要事项..."
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">备注</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="input-field text-sm h-16 resize-none"
                  placeholder="请输入备注信息..."
                />
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
                className="flex-1 btn-primary text-sm flex items-center justify-center gap-1.5"
              >
                <Save size={16} />
                确认交接
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
