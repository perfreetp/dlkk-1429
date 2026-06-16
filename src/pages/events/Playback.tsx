import { useEffect, useState } from 'react';
import { useUiStore } from '@/store';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Download,
  Calendar,
  Clock,
  Video,
  Search,
  Maximize2,
} from 'lucide-react';

export default function Playback() {
  const { setCurrentPageTitle } = useUiStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('08:30:00');
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setCurrentPageTitle('历史回溯');
  }, [setCurrentPageTitle]);

  const timelinePoints = [
    { time: '08:00', label: '08:00' },
    { time: '09:00', label: '09:00' },
    { time: '10:00', label: '10:00' },
    { time: '11:00', label: '11:00' },
    { time: '12:00', label: '12:00' },
    { time: '13:00', label: '13:00' },
    { time: '14:00', label: '14:00' },
    { time: '15:00', label: '15:00' },
    { time: '16:00', label: '16:00' },
    { time: '17:00', label: '17:00' },
    { time: '18:00', label: '18:00' },
    { time: '19:00', label: '19:00' },
    { time: '20:00', label: '20:00' },
  ];

  const eventMarkers = [
    { time: '09:23', type: 'intrusion', label: '入侵检测' },
    { time: '11:45', type: 'fire', label: '烟雾检测' },
    { time: '14:12', type: 'offline', label: '设备离线' },
    { time: '16:30', type: 'fault', label: '设备故障' },
    { time: '18:05', type: 'intrusion', label: '入侵检测' },
  ];

  const typeColors: Record<string, string> = {
    intrusion: 'bg-danger-500',
    fire: 'bg-warning-500',
    offline: 'bg-gray-500',
    fault: 'bg-purple-500',
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-72 glass-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-medium text-white mb-3">录像检索</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">选择日期</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value="2024-06-16"
                    className="w-full h-9 pl-9 pr-3 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-primary-500/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">开始时间</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value="08:00"
                      className="w-full h-9 pl-9 pr-3 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">结束时间</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value="20:00"
                      className="w-full h-9 pl-9 pr-3 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                </div>
              </div>
              <button className="w-full btn-primary text-sm h-9 flex items-center justify-center gap-1.5">
                <Search size={16} />
                检索录像
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-medium text-white mb-3">事件列表</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {eventMarkers.map((event, index) => (
                <div
                  key={index}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${typeColors[event.type]}`} />
                    <span className="text-sm text-gray-200">{event.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">发生时间: {event.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4">
            <h3 className="text-sm font-medium text-white mb-3">设备列表</h3>
            <div className="space-y-1">
              {[
                { name: '市政府大门口', status: 'online' },
                { name: '东城区广场', status: 'online' },
                { name: '火车站入口', status: 'online' },
                { name: '中心医院门诊', status: 'warning' },
                { name: '市民中心大厅', status: 'online' },
                { name: '大学城西门', status: 'offline' },
              ].map((device, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                    index === 0 ? 'bg-primary-500/20' : 'hover:bg-white/5'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      device.status === 'online'
                        ? 'bg-success-500'
                        : device.status === 'warning'
                        ? 'bg-warning-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <Video size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-300 truncate flex-1">
                    {device.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 glass-card p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-white">录像回放 - 市政府大门口</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors">
                  <Download size={18} />
                </button>
                <button className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-dark-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <Video size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500">录像回放中...</p>
                <p className="text-2xl font-mono text-success-400 mt-2">{currentTime}</p>
              </div>

              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
                  <span className="text-xs text-gray-400">REC</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="relative h-12 bg-dark-700 rounded-lg mb-3">
                <div className="absolute inset-y-0 left-0 bg-primary-500/30 w-[45%] rounded-l-lg" />
                
                {timelinePoints.map((point, index) => (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 flex flex-col justify-center"
                    style={{ left: `${(index / (timelinePoints.length - 1)) * 100}%` }}
                  >
                    <div className="w-px h-full bg-white/10" />
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                      {point.label}
                    </span>
                  </div>
                ))}

                {eventMarkers.map((event, index) => {
                  const hour = parseInt(event.time.split(':')[0]);
                  const minute = parseInt(event.time.split(':')[1]);
                  const position = ((hour - 8) * 60 + minute) / (12 * 60) * 100;
                  return (
                    <div
                      key={index}
                      className="absolute top-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ left: `${position}%` }}
                    >
                      <div className={`w-3 h-3 rounded-full ${typeColors[event.type]} border-2 border-dark-700`} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-600 rounded text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {event.label} {event.time}
                      </div>
                    </div>
                  );
                })}

                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                  style={{ left: '45%' }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <SkipBack size={20} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-400 transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <SkipForward size={20} />
                  </button>
                </div>

                <div className="text-sm text-gray-400 font-mono">
                  08:30:00 / 12:00:00
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Volume2 size={18} className="text-gray-400" />
                    <div className="w-20 h-1 bg-dark-700 rounded-full">
                      <div className="w-3/4 h-full bg-primary-500 rounded-full" />
                    </div>
                  </div>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="h-8 px-2 bg-dark-700 border border-white/10 rounded text-sm text-gray-300 focus:outline-none"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={4}>4x</option>
                    <option value={8}>8x</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
