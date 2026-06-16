import { useEffect, useState } from 'react';
import { useUiStore } from '@/store';
import {
  Play,
  Plus,
  Grid3X3,
  LayoutGrid,
  LayoutDashboard,
  Maximize2,
  Settings,
  RefreshCw,
  Volume2,
  Camera,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const layouts = [
  { name: '1分屏', rows: 1, cols: 1, icon: LayoutDashboard },
  { name: '4分屏', rows: 2, cols: 2, icon: LayoutGrid },
  { name: '9分屏', rows: 3, cols: 3, icon: Grid3X3 },
  { name: '16分屏', rows: 4, cols: 4, icon: Grid3X3 },
];

const mockDevices = [
  { id: 1, name: '市政府大门口', org: '市级', status: 'online' },
  { id: 2, name: '东城区广场', org: '东城区', status: 'online' },
  { id: 3, name: '火车站入口', org: '南城区', status: 'online' },
  { id: 4, name: '中心医院门诊', org: '西城区', status: 'warning' },
  { id: 5, name: '市民中心大厅', org: '东城区', status: 'online' },
  { id: 6, name: '大学城西门', org: '北城区', status: 'offline' },
  { id: 7, name: '开发区工业园', org: '南城区', status: 'online' },
  { id: 8, name: '公安局指挥中心', org: '市级', status: 'online' },
  { id: 9, name: '人民广场', org: '西城区', status: 'online' },
];

export default function VideoWall() {
  const { setCurrentPageTitle } = useUiStore();
  const [activeLayout, setActiveLayout] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [cells, setCells] = useState<(typeof mockDevices[0] | null)[]>([]);

  useEffect(() => {
    setCurrentPageTitle('视频上墙');
  }, [setCurrentPageTitle]);

  useEffect(() => {
    const layout = layouts[activeLayout];
    const total = layout.rows * layout.cols;
    const newCells = Array(total).fill(null);
    mockDevices.slice(0, Math.min(total, mockDevices.length)).forEach((device, index) => {
      newCells[index] = device;
    });
    setCells(newCells);
  }, [activeLayout]);

  const layout = layouts[activeLayout];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">布局:</span>
            <div className="flex bg-dark-700 rounded-lg p-1">
              {layouts.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveLayout(index)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
                      activeLayout === index
                        ? 'bg-primary-500/30 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <button className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors">
            <RefreshCw size={18} />
          </button>
          <button className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors">
            <Settings size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm flex items-center gap-1.5">
            <Volume2 size={16} />
            音频
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Maximize2 size={16} />
            全屏
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 glass-card p-4 flex flex-col">
          <div
            className="flex-1 grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
              gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
            }}
          >
            {cells.map((cell, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden border transition-all ${
                  cell
                    ? cell.status === 'online'
                      ? 'border-success-500/30'
                      : cell.status === 'warning'
                      ? 'border-warning-500/30'
                      : 'border-gray-600/30'
                    : 'border-dashed border-white/10'
                } bg-dark-800/50 group`}
              >
                {cell ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera size={32} className="mx-auto text-gray-600 mb-2" />
                        <p className="text-xs text-gray-500">视频画面</p>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-xs text-white/80 bg-black/50 px-2 py-0.5 rounded">
                        {cell.name}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          cell.status === 'online'
                            ? 'bg-success-500'
                            : cell.status === 'warning'
                            ? 'bg-warning-500'
                            : 'bg-gray-500'
                        }`}
                      />
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="text-xs text-gray-400 bg-black/50 px-2 py-0.5 rounded">
                        {cell.org}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
                        <Play size={16} />
                      </button>
                      <button className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
                        <Maximize2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Plus size={24} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-xs text-gray-600">添加视频</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-72 glass-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-medium text-white">视频资源</h3>
            <div className="mt-3">
              <input
                type="text"
                placeholder="搜索设备..."
                className="w-full h-8 pl-3 pr-3 bg-dark-600/50 border border-white/10 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {mockDevices.map((device) => (
              <div
                key={device.id}
                className="p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-2"
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">{device.name}</p>
                  <p className="text-xs text-gray-500">{device.org}</p>
                </div>
                <button className="p-1 text-gray-500 hover:text-primary-400 transition-colors">
                  <Play size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/10">
            <div className="text-xs text-gray-500 mb-2">轮巡设置</div>
            <label className="flex items-center justify-between text-sm text-gray-300 cursor-pointer">
              <span>开启轮巡</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-gray-600 rounded-full peer-checked:bg-primary-500 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
