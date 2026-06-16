import { useEffect } from 'react';
import { useUiStore, useDeviceStore, useAlarmStore } from '@/store';
import ReactECharts from 'echarts-for-react';
import {
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Video,
  Clock,
} from 'lucide-react';

export default function ReportOverview() {
  const { setCurrentPageTitle } = useUiStore();
  const { getDeviceCount, fetchDevices } = useDeviceStore();
  const { getAlarmStats, fetchAlarms } = useAlarmStore();

  useEffect(() => {
    setCurrentPageTitle('统计总览');
    fetchDevices();
    fetchAlarms();
  }, [setCurrentPageTitle, fetchDevices, fetchAlarms]);

  const deviceStats = getDeviceCount();
  const alarmStats = getAlarmStats();

  const onlineRate = deviceStats.total > 0
    ? Math.round((deviceStats.online / deviceStats.total) * 100)
    : 0;

  const alarmTrendOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
    },
    legend: {
      data: ['告警数量', '处置数量', '处置率'],
      textStyle: { color: '#9ca3af', fontSize: 12 },
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
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#6b7280', fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        axisLine: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      },
      {
        type: 'value',
        name: '处置率(%)',
        min: 0,
        max: 100,
        axisLine: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 11, formatter: '{value}%' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '告警数量',
        type: 'bar',
        data: [45, 52, 38, 65, 58, 42, 35],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#E63946' },
              { offset: 1, color: 'rgba(230, 57, 70, 0.3)' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: 16,
      },
      {
        name: '处置数量',
        type: 'bar',
        data: [38, 48, 35, 58, 52, 38, 30],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#2A9D8F' },
              { offset: 1, color: 'rgba(42, 157, 143, 0.3)' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: 16,
      },
      {
        name: '处置率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [84, 92, 92, 89, 90, 90, 86],
        lineStyle: { color: '#F4A261', width: 2 },
        itemStyle: { color: '#F4A261' },
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
      formatter: '{b}: {c}台 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: { color: '#9ca3af', fontSize: 12 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: '设备分布',
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#1A1A2E',
          borderWidth: 3,
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

  const alarmTypeOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
    },
    legend: {
      orient: 'vertical',
      left: 20,
      top: 'center',
      textStyle: { color: '#9ca3af', fontSize: 12 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: '告警类型',
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['70%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#1A1A2E',
          borderWidth: 3,
        },
        label: { show: false },
        data: [
          { value: 28, name: '入侵告警', itemStyle: { color: '#E63946' } },
          { value: 15, name: '消防告警', itemStyle: { color: '#F4A261' } },
          { value: 32, name: '离线告警', itemStyle: { color: '#6B7280' } },
          { value: 18, name: '故障告警', itemStyle: { color: '#8B5CF6' } },
          { value: 12, name: '其他告警', itemStyle: { color: '#2A9D8F' } },
        ],
      },
    ],
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-dark-700/50 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-300">近7天</span>
          </div>
          <button className="btn-secondary text-sm flex items-center gap-1.5">
            <Download size={16} />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">设备总数</span>
            <Video size={20} className="text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">{deviceStats.total}</p>
          <p className="text-xs text-gray-500 mt-2">较上周 <span className="text-success-400">+12 台</span></p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">设备在线率</span>
            <TrendingUp size={20} className="text-success-400" />
          </div>
          <p className="text-3xl font-bold text-success-400 tabular-nums">{onlineRate}%</p>
          <p className="text-xs text-gray-500 mt-2">较上周 <span className="text-success-400">+2.3%</span></p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">本周告警</span>
            <AlertTriangle size={20} className="text-warning-400" />
          </div>
          <p className="text-3xl font-bold text-warning-400 tabular-nums">335</p>
          <p className="text-xs text-gray-500 mt-2">较上周 <span className="text-danger-400">+15%</span></p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">平均处置时长</span>
            <Clock size={20} className="text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-primary-400 tabular-nums">18<span className="text-lg">分钟</span></p>
          <p className="text-xs text-gray-500 mt-2">较上周 <span className="text-success-400">-5分钟</span></p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
        <div className="col-span-2 glass-card p-5">
          <h3 className="text-base font-medium text-white mb-4">告警趋势分析</h3>
          <ReactECharts option={alarmTrendOption} style={{ height: 'calc(100% - 32px)' }} />
        </div>

        <div className="flex flex-col gap-4 min-h-0">
          <div className="glass-card p-5 flex-1">
            <h3 className="text-sm font-medium text-white mb-3">设备区域分布</h3>
            <ReactECharts option={deviceDistributionOption} style={{ height: 'calc(100% - 28px)' }} />
          </div>
          <div className="glass-card p-5 flex-1">
            <h3 className="text-sm font-medium text-white mb-3">告警类型分布</h3>
            <ReactECharts option={alarmTypeOption} style={{ height: 'calc(100% - 28px)' }} />
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-base font-medium text-white mb-4">各区县数据对比</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">区域</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">设备总数</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">在线设备</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">离线设备</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">在线率</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">本周告警</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">处置率</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: '东城区', total: 256, online: 245, offline: 11, rate: 95.7, alarms: 68, disposeRate: 92 },
                { name: '西城区', total: 198, online: 189, offline: 9, rate: 95.5, alarms: 52, disposeRate: 94 },
                { name: '南城区', total: 312, online: 298, offline: 14, rate: 95.5, alarms: 85, disposeRate: 89 },
                { name: '北城区', total: 176, online: 168, offline: 8, rate: 95.5, alarms: 45, disposeRate: 93 },
                { name: '直属单位', total: 128, online: 124, offline: 4, rate: 96.9, alarms: 28, disposeRate: 96 },
              ].map((item, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-gray-200">{item.name}</td>
                  <td className="py-3 px-4 text-center text-gray-300 tabular-nums">{item.total}</td>
                  <td className="py-3 px-4 text-center text-success-400 tabular-nums">{item.online}</td>
                  <td className="py-3 px-4 text-center text-gray-500 tabular-nums">{item.offline}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-20 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-success-500 to-success-400 rounded-full"
                          style={{ width: `${item.rate}%` }}
                        />
                      </div>
                      <span className="text-success-400 text-xs tabular-nums">{item.rate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-warning-400 tabular-nums">{item.alarms}</td>
                  <td className="py-3 px-4 text-center text-primary-400 tabular-nums">{item.disposeRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
