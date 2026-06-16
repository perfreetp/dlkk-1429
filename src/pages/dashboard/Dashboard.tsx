import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  AlertTriangle,
  Building2,
  Users,
  Play,
  Settings,
  BarChart3,
  MessageSquare,
  ChevronRight,
  Activity,
  Clock,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import StatCard from '@/components/StatCard';
import MapView from '@/components/MapView';
import OrgTree from '@/components/OrgTree';
import { useDeviceStore, useAlarmStore, useOrgStore, useUserStore, useUiStore } from '@/store';
import { useUiStore as _ } from '@/store';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getDeviceCount, fetchDevices } = useDeviceStore();
  const { getAlarmStats, alarms, fetchAlarms } = useAlarmStore();
  const { orgList, fetchOrgTree } = useOrgStore();
  const { users, fetchUsers } = useUserStore();
  const { setCurrentPageTitle } = useUiStore();
  const [activeTab, setActiveTab] = useState<'map' | 'tree'>('map');

  useEffect(() => {
    setCurrentPageTitle('总览驾驶舱');
    fetchDevices();
    fetchAlarms();
    fetchOrgTree();
    fetchUsers();
  }, [setCurrentPageTitle, fetchDevices, fetchAlarms, fetchOrgTree, fetchUsers]);

  const deviceStats = getDeviceCount();
  const alarmStats = getAlarmStats();
  const onlineRate = deviceStats.total > 0
    ? Math.round((deviceStats.online / deviceStats.total) * 100)
    : 0;

  const recentAlarms = alarms.slice(0, 5);
  const onlineUsers = users.filter((u) => u.status === 'active').length;

  const alarmTrendOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
    },
    legend: {
      data: ['告警数', '处置数'],
      textStyle: { color: '#9ca3af', fontSize: 11 },
      top: 0,
      right: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#6b7280', fontSize: 10 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: '告警数',
        type: 'line',
        smooth: true,
        data: [8, 5, 12, 18, 25, 20, 10],
        lineStyle: { color: '#E63946', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(230, 57, 70, 0.3)' },
              { offset: 1, color: 'rgba(230, 57, 70, 0)' },
            ],
          },
        },
        itemStyle: { color: '#E63946' },
      },
      {
        name: '处置数',
        type: 'line',
        smooth: true,
        data: [6, 4, 10, 15, 22, 18, 9],
        lineStyle: { color: '#2A9D8F', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(42, 157, 143, 0.3)' },
              { offset: 1, color: 'rgba(42, 157, 143, 0)' },
            ],
          },
        },
        itemStyle: { color: '#2A9D8F' },
      },
    ],
  };

  const deviceDistributionOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#9ca3af', fontSize: 11 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: '设备分布',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#1A1A2E',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff',
          },
        },
        data: [
          { value: 256, name: '东城区', itemStyle: { color: '#2A9D8F' } },
          { value: 198, name: '西城区', itemStyle: { color: '#0A2463' } },
          { value: 312, name: '南城区', itemStyle: { color: '#F4A261' } },
          { value: 176, name: '北城区', itemStyle: { color: '#E63946' } },
          { value: 128, name: '直属单位', itemStyle: { color: '#8B5CF6' } },
        ],
      },
    ],
  };

  const quickActions = [
    { icon: <Play size={20} />, label: '视频上墙', path: '/cascade/wall', color: 'primary' },
    { icon: <AlertTriangle size={20} />, label: '告警中心', path: '/events/alarms', color: 'warning' },
    { icon: <MessageSquare size={20} />, label: '发起会商', path: '/events/conference', color: 'success' },
    { icon: <BarChart3 size={20} />, label: '统计报表', path: '/reports/overview', color: 'primary' },
  ];

  const levelColor = {
    critical: 'bg-danger-500/20 text-danger-300 border-danger-500/30',
    major: 'bg-warning-500/20 text-warning-300 border-warning-500/30',
    minor: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
    tip: 'bg-success-500/20 text-success-300 border-success-500/30',
  };

  const statusLabel: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    dispatched: '已分派',
    closed: '已关闭',
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="视频设备总数"
          value={deviceStats.total}
          unit="台"
          icon={<Video size={24} />}
          trend={2.5}
          trendLabel="较昨日"
          color="primary"
        />
        <StatCard
          title="在线设备"
          value={deviceStats.online}
          unit="台"
          icon={<Activity size={24} />}
          trend={onlineRate}
          trendLabel={`在线率 ${onlineRate}%`}
          color="success"
        />
        <StatCard
          title="今日告警"
          value={alarmStats.total > 0 ? Math.floor(alarmStats.total / 5) : 0}
          unit="起"
          icon={<AlertTriangle size={24} />}
          trend={-12}
          trendLabel="较昨日"
          color="warning"
        />
        <StatCard
          title="在线单位"
          value={orgList.length}
          unit="个"
          icon={<Building2 size={24} />}
          trend={0}
          trendLabel={`在线人员 ${onlineUsers} 人`}
          color="primary"
        />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        <div className="col-span-9 flex flex-col gap-4 min-h-0">
          <div className="glass-card flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-base font-medium text-white">资源总览</h3>
                <div className="flex bg-dark-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                      activeTab === 'map'
                        ? 'bg-primary-500/30 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    地图视图
                  </button>
                  <button
                    onClick={() => setActiveTab('tree')}
                    className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                      activeTab === 'tree'
                        ? 'bg-primary-500/30 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    组织视图
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs bg-white/10 text-gray-300 rounded hover:bg-white/20 transition-colors flex items-center gap-1">
                  <Settings size={14} />
                  设置
                </button>
                <button
                  onClick={() => navigate('/cascade/wall')}
                  className="px-3 py-1.5 text-xs bg-primary-500/20 text-primary-300 rounded hover:bg-primary-500/30 transition-colors flex items-center gap-1"
                >
                  <Play size={14} />
                  一键上墙
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 p-0">
              {activeTab === 'map' ? (
                <div className="w-full h-full">
                  <MapView />
                </div>
              ) : (
                <div className="h-full p-4 overflow-y-auto">
                  <OrgTree showDeviceCount />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 h-64">
              <h3 className="text-sm font-medium text-white mb-4">告警趋势（今日）</h3>
              <ReactECharts option={alarmTrendOption} style={{ height: 'calc(100% - 32px)' }} />
            </div>
            <div className="glass-card p-4 h-64">
              <h3 className="text-sm font-medium text-white mb-4">各区县设备分布</h3>
              <ReactECharts
                option={deviceDistributionOption}
                style={{ height: 'calc(100% - 32px)' }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-white mb-3">快捷操作</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div
                    className={`p-3 rounded-lg ${
                      action.color === 'primary'
                        ? 'bg-primary-500/20 text-primary-400 group-hover:bg-primary-500/30'
                        : action.color === 'success'
                        ? 'bg-success-500/20 text-success-400 group-hover:bg-success-500/30'
                        : 'bg-warning-500/20 text-warning-400 group-hover:bg-warning-500/30'
                    } transition-colors`}
                  >
                    {action.icon}
                  </div>
                  <span className="text-xs text-gray-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">实时告警</h3>
              <button
                onClick={() => navigate('/events/alarms')}
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                查看全部
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {recentAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={() => navigate('/events/alarms')}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs border ${levelColor[alarm.level]}`}
                    >
                      {alarm.level === 'critical'
                        ? '紧急'
                        : alarm.level === 'major'
                        ? '重要'
                        : alarm.level === 'minor'
                        ? '一般'
                        : '提示'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {alarm.createTime.split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 mb-1 truncate">{alarm.title}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{alarm.deviceName}</span>
                    <span className="text-gray-400">{statusLabel[alarm.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white">在线人员</h3>
              <span className="text-xs text-success-400">{onlineUsers} 人在线</span>
            </div>
            <div className="flex -space-x-2">
              {users.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-dark-600 flex items-center justify-center text-white text-xs font-medium"
                  style={{ zIndex: 5 - index }}
                  title={user.realName}
                >
                  {user.realName.charAt(0)}
                </div>
              ))}
              {users.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-dark-600 flex items-center justify-center text-gray-400 text-xs">
                  +{users.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
