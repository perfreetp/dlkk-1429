import { useEffect } from 'react';
import { useUiStore, useAlarmStore } from '@/store';
import ReactECharts from 'echarts-for-react';
import { Download, Calendar, TrendingUp } from 'lucide-react';

export default function AlarmReport() {
  const { setCurrentPageTitle } = useUiStore();
  const { getAlarmStats, fetchAlarms } = useAlarmStore();

  useEffect(() => {
    setCurrentPageTitle('告警统计');
    fetchAlarms();
  }, [setCurrentPageTitle, fetchAlarms]);

  const stats = getAlarmStats();

  const alarmLevelOption = {
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
        name: '告警等级',
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
          { value: 8, name: '紧急', itemStyle: { color: '#E63946' } },
          { value: 15, name: '重要', itemStyle: { color: '#F4A261' } },
          { value: 22, name: '一般', itemStyle: { color: '#0A2463' } },
          { value: 5, name: '提示', itemStyle: { color: '#2A9D8F' } },
        ],
      },
    ],
  };

  const alarmTypeOption = {
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
      type: 'category',
      data: ['入侵告警', '消防告警', '离线告警', '故障告警', '其他告警'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 18, itemStyle: { color: '#E63946' } },
          { value: 12, itemStyle: { color: '#F4A261' } },
          { value: 25, itemStyle: { color: '#6B7280' } },
          { value: 15, itemStyle: { color: '#8B5CF6' } },
          { value: 10, itemStyle: { color: '#2A9D8F' } },
        ],
        barWidth: 36,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  const handleTimeOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
    },
    legend: {
      data: ['平均响应时长', '平均处置时长'],
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
    },
    yAxis: {
      type: 'value',
      name: '分钟',
      axisLine: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: '平均响应时长',
        type: 'line',
        smooth: true,
        data: [5, 4, 6, 3, 5, 8, 7],
        lineStyle: { color: '#2A9D8F', width: 2 },
        itemStyle: { color: '#2A9D8F' },
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
      },
      {
        name: '平均处置时长',
        type: 'line',
        smooth: true,
        data: [22, 18, 25, 15, 20, 30, 28],
        lineStyle: { color: '#F4A261', width: 2 },
        itemStyle: { color: '#F4A261' },
      },
    ],
  };

  const districtAlarmOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
    },
    legend: {
      data: ['紧急', '重要', '一般', '提示'],
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
      data: ['东城区', '西城区', '南城区', '北城区', '直属单位'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: '紧急',
        type: 'bar',
        stack: 'total',
        data: [3, 2, 2, 1, 0],
        itemStyle: { color: '#E63946' },
      },
      {
        name: '重要',
        type: 'bar',
        stack: 'total',
        data: [5, 3, 4, 2, 1],
        itemStyle: { color: '#F4A261' },
      },
      {
        name: '一般',
        type: 'bar',
        stack: 'total',
        data: [8, 6, 10, 5, 3],
        itemStyle: { color: '#0A2463' },
      },
      {
        name: '提示',
        type: 'bar',
        stack: 'total',
        data: [2, 1, 3, 1, 2],
        itemStyle: { color: '#2A9D8F' },
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

      <div className="grid grid-cols-5 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm text-gray-400 mb-1">告警总数</p>
          <p className="text-3xl font-bold text-white tabular-nums">{stats.total}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-gray-400 mb-1">待处理</p>
          <p className="text-3xl font-bold text-warning-400 tabular-nums">{stats.pending}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-gray-400 mb-1">处置中</p>
          <p className="text-3xl font-bold text-primary-400 tabular-nums">{stats.processing + stats.dispatched}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-gray-400 mb-1">已关闭</p>
          <p className="text-3xl font-bold text-success-400 tabular-nums">{stats.closed}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-gray-400 mb-1">处置率</p>
          <p className="text-3xl font-bold text-primary-400 tabular-nums">
            {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
        <div className="glass-card p-5">
          <h3 className="text-base font-medium text-white mb-4">告警等级分布</h3>
          <ReactECharts option={alarmLevelOption} style={{ height: 'calc(100% - 32px)' }} />
        </div>

        <div className="glass-card p-5">
          <h3 className="text-base font-medium text-white mb-4">告警类型统计</h3>
          <ReactECharts option={alarmTypeOption} style={{ height: 'calc(100% - 32px)' }} />
        </div>

        <div className="glass-card p-5">
          <h3 className="text-base font-medium text-white mb-4">处理时效趋势</h3>
          <ReactECharts option={handleTimeOption} style={{ height: 'calc(100% - 32px)' }} />
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-base font-medium text-white mb-4">各区域告警统计</h3>
        <div className="h-64">
          <ReactECharts option={districtAlarmOption} style={{ height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
