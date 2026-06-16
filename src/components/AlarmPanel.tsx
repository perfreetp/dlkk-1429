import { X, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useUiStore, useAlarmStore } from '@/store';
import { useEffect } from 'react';

const levelConfig = {
  critical: { label: '紧急', color: 'bg-danger-500/20 text-danger-300 border-danger-500/30' },
  major: { label: '重要', color: 'bg-warning-500/20 text-warning-300 border-warning-500/30' },
  minor: { label: '一般', color: 'bg-primary-500/20 text-primary-300 border-primary-500/30' },
  tip: { label: '提示', color: 'bg-success-500/20 text-success-300 border-success-500/30' },
};

const statusConfig = {
  pending: { label: '待处理', icon: Clock, color: 'text-warning-400' },
  processing: { label: '处理中', icon: AlertTriangle, color: 'text-primary-400' },
  dispatched: { label: '已分派', icon: ArrowRight, color: 'text-success-400' },
  closed: { label: '已关闭', icon: CheckCircle, color: 'text-gray-500' },
};

export default function AlarmPanel() {
  const { showAlarmPanel, setShowAlarmPanel } = useUiStore();
  const { alarms, getAlarmStats, fetchAlarms, confirmAlarm, setSelectedAlarm } = useAlarmStore();

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  const stats = getAlarmStats();
  const pendingAlarms = alarms.filter((a) => a.status === 'pending' || a.status === 'processing').slice(0, 10);

  if (!showAlarmPanel) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-dark-700/95 backdrop-blur-xl border-l border-white/10 z-40 animate-slide-left flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">实时告警</h3>
        <button
          onClick={() => setShowAlarmPanel(false)}
          className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="glass-card p-3">
          <p className="text-xs text-gray-400 mb-1">待处理</p>
          <p className="text-2xl font-bold text-warning-400 tabular-nums">{stats.pending}</p>
        </div>
        <div className="glass-card p-3">
          <p className="text-xs text-gray-400 mb-1">处理中</p>
          <p className="text-2xl font-bold text-primary-400 tabular-nums">{stats.processing}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {pendingAlarms.map((alarm) => {
          const level = levelConfig[alarm.level];
          const status = statusConfig[alarm.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={alarm.id}
              className="glass-card p-3 hover:bg-glass-light cursor-pointer transition-all group"
              onClick={() => setSelectedAlarm(alarm)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${level.color}`}>
                  {level.label}
                </span>
                <span className={`flex items-center gap-1 text-xs ${status.color}`}>
                  <StatusIcon size={12} />
                  {status.label}
                </span>
              </div>
              <h4 className="text-sm font-medium text-white mb-1 group-hover:text-primary-300 transition-colors">
                {alarm.title}
              </h4>
              <p className="text-xs text-gray-400 mb-2">{alarm.deviceName}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{alarm.orgName}</span>
                <span>{alarm.createTime}</span>
              </div>
              {alarm.status === 'pending' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmAlarm(alarm.id);
                  }}
                  className="mt-3 w-full py-1.5 bg-primary-500/20 text-primary-300 text-xs rounded hover:bg-primary-500/30 transition-colors"
                >
                  确认告警
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button className="w-full py-2 bg-primary-500/20 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-colors text-sm font-medium">
          查看全部告警
        </button>
      </div>
    </div>
  );
}
