import { useEffect, useState, useRef } from 'react';
import { useUiStore } from '@/store';
import {
  Play,
  Plus,
  Grid3X3,
  LayoutGrid,
  LayoutDashboard,
  Maximize2,
  Minimize2,
  Settings,
  RefreshCw,
  Volume2,
  Camera,
  Search,
  X,
  Trash2,
  Edit3,
} from 'lucide-react';

const layouts = [
  { name: '1分屏', rows: 1, cols: 1, icon: LayoutDashboard },
  { name: '4分屏', rows: 2, cols: 2, icon: LayoutGrid },
  { name: '9分屏', rows: 3, cols: 3, icon: Grid3X3 },
  { name: '16分屏', rows: 4, cols: 4, icon: Grid3X3 },
];

interface WallDevice {
  id: string;
  name: string;
  org: string;
  status: 'online' | 'offline' | 'warning';
}

const mockDevices: WallDevice[] = [
  { id: 'd1', name: '市政府大门口', org: '市级', status: 'online' },
  { id: 'd2', name: '东城区广场', org: '东城区', status: 'online' },
  { id: 'd3', name: '火车站入口', org: '南城区', status: 'online' },
  { id: 'd4', name: '中心医院门诊', org: '西城区', status: 'warning' },
  { id: 'd5', name: '市民中心大厅', org: '东城区', status: 'online' },
  { id: 'd6', name: '大学城西门', org: '北城区', status: 'offline' },
  { id: 'd7', name: '开发区工业园', org: '南城区', status: 'online' },
  { id: 'd8', name: '公安局指挥中心', org: '市级', status: 'online' },
  { id: 'd9', name: '人民广场', org: '西城区', status: 'online' },
  { id: 'd10', name: '高铁站出口', org: '南城区', status: 'online' },
  { id: 'd11', name: '机场航站楼', org: '北城区', status: 'online' },
  { id: 'd12', name: '会展中心', org: '东城区', status: 'warning' },
];

export default function VideoWall() {
  const { setCurrentPageTitle } = useUiStore();
  const [activeLayout, setActiveLayout] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [cells, setCells] = useState<(WallDevice | null)[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPageTitle('视频上墙');
  }, [setCurrentPageTitle]);

  useEffect(() => {
    const layout = layouts[activeLayout];
    const total = layout.rows * layout.cols;
    setCells(prev => {
      const newCells = Array(total).fill(null);
      prev.forEach((device, index) => {
        if (index < total && device) {
          newCells[index] = device;
        }
      });
      return newCells;
    });
  }, [activeLayout]);

  const layout = layouts[activeLayout];

  const filteredDevices = mockDevices.filter(
    (d) =>
      d.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      d.org.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const usedDeviceIds = new Set(cells.filter(Boolean).map((d) => d!.id));
  const availableDevices = filteredDevices.filter((d) => !usedDeviceIds.has(d.id));

  const handleCellClick = (index: number) => {
    if (cells[index]) {
      setSelectedCellIndex(index);
    } else {
      setSelectedCellIndex(index);
    }
  };

  const handleAddDevice = (device: WallDevice) => {
    if (selectedCellIndex !== null && !cells[selectedCellIndex]) {
      const newCells = [...cells];
      newCells[selectedCellIndex] = device;
      setCells(newCells);
      setSelectedCellIndex(null);
    }
  };

  const handleReplaceDevice = (device: WallDevice) => {
    if (replaceIndex !== null) {
      const newCells = [...cells];
      newCells[replaceIndex] = device;
      setCells(newCells);
      setShowReplaceModal(false);
      setReplaceIndex(null);
    }
  };

  const handleRemoveDevice = (index: number) => {
    const newCells = [...cells];
    newCells[index] = null;
    setCells(newCells);
    if (selectedCellIndex === index) {
      setSelectedCellIndex(null);
    }
  };

  const handleReplaceClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setReplaceIndex(index);
    setShowReplaceModal(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleLayoutChange = (index: number) => {
    setActiveLayout(index);
    setSelectedCellIndex(null);
  };

  const handleRefresh = () => {
    setCells([...cells]);
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col gap-4">
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
                    onClick={() => handleLayoutChange(index)}
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
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
            title="刷新"
          >
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
            onClick={toggleFullscreen}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {fullscreen ? '退出全屏' : '全屏'}
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
                onClick={() => handleCellClick(index)}
                className={`relative rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  cell
                    ? cell.status === 'online'
                      ? 'border-success-500/30'
                      : cell.status === 'warning'
                      ? 'border-warning-500/30'
                      : 'border-gray-600/30'
                    : selectedCellIndex === index
                    ? 'border-primary-500 border-dashed bg-primary-500/10'
                    : 'border-dashed border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5'
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                      >
                        <Play size={16} />
                      </button>
                      <button
                        onClick={(e) => handleReplaceClick(index, e)}
                        className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                        title="替换"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDevice(index);
                        }}
                        className="p-2 bg-danger-500/50 rounded-full text-white hover:bg-danger-500/70 transition-colors"
                        title="移除"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullscreen();
                        }}
                        className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                      >
                        <Maximize2 size={16} />
                      </button>
                    </div>
                    {selectedCellIndex === index && (
                      <div className="absolute top-2 right-10">
                        <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded">
                          已选中
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Plus
                        size={24}
                        className={`mx-auto mb-1 ${selectedCellIndex === index ? 'text-primary-400' : 'text-gray-600'}`}
                      />
                      <p
                        className={`text-xs ${selectedCellIndex === index ? 'text-primary-400' : 'text-gray-600'}`}
                      >
                        {selectedCellIndex === index ? '请从右侧选择设备' : '添加视频'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-72 glass-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-medium text-white mb-3">视频资源</h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="搜索设备..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full h-8 pl-10 pr-8 bg-dark-600/50 border border-white/10 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {availableDevices.length > 0 ? (
              availableDevices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => handleAddDevice(device)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                    selectedCellIndex !== null && !cells[selectedCellIndex]
                      ? 'hover:bg-primary-500/20 bg-white/5'
                      : 'hover:bg-white/5 opacity-60 cursor-not-allowed'
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{device.name}</p>
                    <p className="text-xs text-gray-500">{device.org}</p>
                  </div>
                  <button
                    disabled={selectedCellIndex === null || cells[selectedCellIndex] !== null}
                    className="p-1 text-gray-500 hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Camera size={32} className="mx-auto text-gray-600 mb-2" />
                <p className="text-sm text-gray-500">
                  {searchKeyword ? '未找到匹配设备' : '暂无可用设备'}
                </p>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-white/10">
            <div className="text-xs text-gray-500 mb-2">已上墙: {cells.filter(Boolean).length} / {cells.length} 窗口</div>
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

      {showReplaceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-96 p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">替换视频源</h3>
              <button
                onClick={() => {
                  setShowReplaceModal(false);
                  setReplaceIndex(null);
                }}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="搜索设备..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full h-9 pl-10 pr-3 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {availableDevices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => handleReplaceDevice(device)}
                  className="p-3 rounded-lg hover:bg-primary-500/20 bg-white/5 cursor-pointer transition-colors flex items-center gap-3"
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
                  <div className="flex-1">
                    <p className="text-sm text-gray-200">{device.name}</p>
                    <p className="text-xs text-gray-500">{device.org}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowReplaceModal(false);
                  setReplaceIndex(null);
                }}
                className="flex-1 btn-secondary text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
