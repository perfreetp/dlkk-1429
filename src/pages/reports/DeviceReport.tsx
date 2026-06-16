import { useEffect } from 'react';
import { useUiStore, useDeviceStore } from '@/store';
import ReactECharts from 'echarts-for-react';
import { Download, Calendar } from 'lucide-react';

export default function DeviceReport() {
  const { setCurrentPageTitle } = useUiStore();
  const { getDeviceCount, fetchDevices } = useDeviceStore();

  useEffect(() => {
    setCurrentPageTitle('设备统计');
    fetchDevices();
  }, [setCurrentPageTitle, fetchDevices]);

  const stats = getDeviceCount();
  const onlineRate = stats.total > 0 ? Math.round((stats.online / stats.total) * 100) : 0;

  const onlineTrendOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
    },
    legend: {
      data: ['在线设备', '离线设备', '在线率'],
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
        name: '设备数',
        axisLine: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      },
      {
        type: 'value',
        name: '在线率(%)',
        min: 90,
        max: 100,
        axisLine: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 11, formatter: '{value}%' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '在线设备',
        type: 'bar',
        stack: 'total',
        data: [920, 935, 918, 942, 930, 905, 928],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#2A9D8F' },
              { offset: 1, color: 'rgba(42, 157, 143, 0.3)' },
            ],
          },
        },
        barWidth: 20,
      },
      {
        name: '离线设备',
        type: 'bar',
        stack: 'total',
        data: [56, 41, 58, 34, 46, 71, 48],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#6B7280' },
              { offset: 1, color: 'rgba(107, 114, 128, 0.3)' },
            ],
          },
        },
        barWidth: 20,
      },
      {
        name: '在线率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [94.2, 95.8, 94.0, 96.5, 95.3, 92.7, 95.1],
        lineStyle: { color: '#F4A261', width: 2 },
        itemStyle: { color: '#F4A261' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(244, 162, 97, 0.2)' },
              { offset: 1, color: 'rgba(244, 162, 97, 0)' },
            ],
          },
        },
      },
    ],
  };

  const deviceTypeOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
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
        name: '设备类型',
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
        data: [
          { value: 780, name: '网络摄像机', itemStyle: { color: '#2A9D8F' } },
          { value: 180, name: '球机', itemStyle: { color: '#0A2463' } },
          { value: 85, name: 'NVR录像机', itemStyle: { color: '#F4A261' } },
          { value: 45, name: '编码器', itemStyle: { color: '#8B5CF6' } },
          { value: 35, name: '其他', itemStyle: { color: '#6B7280' } },
        ],
      },
    ],
  };

  const manufacturerOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    yAxis: {
      type: 'category',
      data: ['海康威视', '大华股份', '宇视科技', '华为', '天地伟业'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 420, itemStyle: { color: '#2A9D8F' } },
          { value: 310, itemStyle: { color: '#0A2463' } },
          { value: 180, itemStyle: { color: '#F4A261' } },
          { value: 120, itemStyle: { color: '#8B5CF6' } },
          { value: 95, itemStyle: { color: '#6B7280' } },
        ],
        barWidth: 16,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
        },
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
        </div>
        <button className="btn-secondary text-sm flex items-center gap-1.5">
          <Download size={16} />
          导出报表
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm text-gray-400 mb-1">设备总数</p>
          <p className="text-3xl font-bold text-white tabular-nums">{stats.total}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-gray-400 mb-1">在线设备</p>
          <p className="text-3xl font-bold text-success-400 tabular-nums">{stats.online}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-gray-400 mb-1">离线设备</p>
          <p className="text-3xl font-bold text-gray-400 tabular-nums">{stats.offline}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-gray-400 mb-1">在线率</p>
          <p className="text-3xl font-bold text-primary-400 tabular-nums">{onlineRate}%</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
        <div className="col-span-2 glass-card p-5">
          <h3 className="text-base font-medium text-white mb-4">设备在线趋势</h3>
          <ReactECharts option={onlineTrendOption} style={{ height: 'calc(100% - 32px)' }} />
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-white mb-3">设备类型分布</h3>
          <ReactECharts option={deviceTypeOption} style={{ height: 'calc(100% - 28px)' }} />
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-base font-medium text-white mb-4">品牌分布统计</h3>
        <div className="h-64">
          <ReactECharts option={manufacturerOption} style={{ height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
