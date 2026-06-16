import { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';
import { useDeviceStore, useOrgStore } from '@/store';

interface MapDevice {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'online' | 'offline' | 'warning';
}

export default function MapView() {
  const { devices, fetchDevices } = useDeviceStore();
  const { orgList, fetchOrgTree } = useOrgStore();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selectedDevice, setSelectedDevice] = useState<MapDevice | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDevices();
    fetchOrgTree();
  }, [fetchDevices, fetchOrgTree]);

  const mapDevices: MapDevice[] = devices.slice(0, 40).map((device, index) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    return {
      id: device.id,
      name: device.name,
      x: 80 + col * 100 + Math.random() * 40,
      y: 80 + row * 80 + Math.random() * 30,
      status: device.status,
    };
  });

  const statusColor = {
    online: '#2A9D8F',
    offline: '#6B7280',
    warning: '#F4A261',
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const districts = [
    { name: '东城区', x: 150, y: 120, width: 280, height: 200, color: 'rgba(42, 157, 143, 0.15)' },
    { name: '西城区', x: 450, y: 120, width: 250, height: 200, color: 'rgba(10, 36, 99, 0.2)' },
    { name: '南城区', x: 150, y: 340, width: 280, height: 180, color: 'rgba(244, 162, 97, 0.15)' },
    { name: '北城区', x: 450, y: 340, width: 250, height: 180, color: 'rgba(230, 57, 70, 0.1)' },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden glass-card">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 glass-card flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 glass-card flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
        >
          <ZoomOut size={18} />
        </button>
        <button className="w-9 h-9 glass-card flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg">
          <Layers size={18} />
        </button>
        <button className="w-9 h-9 glass-card flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg">
          <Maximize2 size={18} />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 glass-card px-3 py-2 text-xs text-gray-400">
        缩放: {Math.round(zoom * 100)}%
      </div>

      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="w-full h-full"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          viewBox="0 0 800 560"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="800" height="560" fill="url(#grid)" />

          {districts.map((district, index) => (
            <g key={index}>
              <rect
                x={district.x}
                y={district.y}
                width={district.width}
                height={district.height}
                fill={district.color}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                rx="8"
                className="hover:fill-opacity-50 transition-all cursor-pointer"
              />
              <text
                x={district.x + district.width / 2}
                y={district.y + 24}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="14"
                fontWeight="500"
              >
                {district.name}
              </text>
            </g>
          ))}

          {mapDevices.map((device) => (
            <g
              key={device.id}
              className="cursor-pointer"
              onClick={() => setSelectedDevice(device)}
            >
              <circle
                cx={device.x}
                cy={device.y}
                r="10"
                fill={statusColor[device.status]}
                opacity="0.3"
                filter="url(#glow)"
              >
                <animate
                  attributeName="r"
                  values="10;18;10"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.1;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={device.x}
                cy={device.y}
                r="6"
                fill={statusColor[device.status]}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>
      </div>

      {selectedDevice && (
        <div
          className="absolute glass-card p-3 min-w-48 z-20 animate-fade-in"
          style={{
            left: `${Math.min(selectedDevice.x * 0.8 + 50, 500)}px`,
            top: `${Math.min(selectedDevice.y * 0.6 + 30, 400)}px`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white">{selectedDevice.name}</h4>
            <span
              className={`status-${selectedDevice.status}`}
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {selectedDevice.status === 'online'
                ? '在线'
                : selectedDevice.status === 'offline'
                ? '离线'
                : '告警'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3">设备编号: {selectedDevice.id}</p>
          <div className="flex gap-2">
            <button className="flex-1 py-1.5 text-xs bg-primary-500/20 text-primary-300 rounded hover:bg-primary-500/30 transition-colors">
              查看视频
            </button>
            <button className="flex-1 py-1.5 text-xs bg-white/10 text-gray-300 rounded hover:bg-white/20 transition-colors">
              详情
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 glass-card p-3">
        <p className="text-xs text-gray-400 mb-2">设备状态</p>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success-500"></span>
            <span className="text-gray-300">在线</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-warning-500"></span>
            <span className="text-gray-300">告警</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
            <span className="text-gray-300">离线</span>
          </div>
        </div>
      </div>
    </div>
  );
}
