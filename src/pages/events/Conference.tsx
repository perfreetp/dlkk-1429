import { useEffect, useState } from 'react';
import { useUiStore, useUserStore } from '@/store';
import {
  Plus,
  Users,
  Video,
  Phone,
  MessageSquare,
  Clock,
  MoreHorizontal,
  X,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  PhoneOff,
} from 'lucide-react';

export default function Conference() {
  const { setCurrentPageTitle } = useUiStore();
  const { users, fetchUsers } = useUserStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: '火车站区域应急会商',
      creator: '张建国',
      createTime: '2024-06-16 09:30:00',
      status: 'ongoing',
      participantCount: 6,
      participants: [
        { name: '张建国', org: '市级综治中心', role: '主持人' },
        { name: '李美玲', org: '东城区综治中心', role: '参会人' },
        { name: '王志强', org: '南城区综治中心', role: '参会人' },
        { name: '赵明华', org: '市公安局', role: '参会人' },
        { name: '孙晓峰', org: '消防支队', role: '参会人' },
        { name: '周文涛', org: '应急管理局', role: '参会人' },
      ],
    },
    {
      id: 2,
      name: '日常值班例会',
      creator: '李美玲',
      createTime: '2024-06-16 08:00:00',
      status: 'ended',
      participantCount: 4,
      duration: '1小时30分',
    },
    {
      id: 3,
      name: '中心医院安保协调会',
      creator: '王志强',
      createTime: '2024-06-15 14:00:00',
      status: 'ended',
      participantCount: 5,
      duration: '45分钟',
    },
  ]);

  useEffect(() => {
    setCurrentPageTitle('会商中心');
    fetchUsers();
  }, [setCurrentPageTitle, fetchUsers]);

  const handleJoinRoom = (room: typeof rooms[0]) => {
    setActiveRoom(room);
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {!activeRoom ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">会商会议</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              创建会商
            </button>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="col-span-2 glass-card p-5">
              <h3 className="text-base font-medium text-white mb-4">进行中的会议</h3>
              <div className="space-y-3">
                {rooms.filter(r => r.status === 'ongoing').map((room) => (
                  <div
                    key={room.id}
                    className="p-4 glass-card-hover cursor-pointer"
                    onClick={() => handleJoinRoom(room)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary-500/20 rounded-xl">
                          <Video size={24} className="text-primary-400" />
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-white">{room.name}</h4>
                          <p className="text-sm text-gray-500">
                            主持人: {room.creator} · {room.createTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-danger-500/20 text-danger-400 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-danger-500 animate-pulse" />
                          进行中
                        </span>
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {room.participants?.slice(0, 5).map((p, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-dark-600 flex items-center justify-center text-white text-xs font-medium"
                            style={{ zIndex: 5 - i }}
                          >
                            {p.name.charAt(0)}
                          </div>
                        ))}
                        {room.participantCount > 5 && (
                          <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-dark-600 flex items-center justify-center text-gray-400 text-xs">
                            +{room.participantCount - 5}
                          </div>
                        )}
                      </div>
                      <button className="btn-success text-sm px-4 py-1.5">
                        加入会议
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-base font-medium text-white mb-4">历史会议</h3>
              <div className="space-y-3">
                {rooms.filter(r => r.status === 'ended').map((room) => (
                  <div
                    key={room.id}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-200">{room.name}</h4>
                      <span className="text-xs text-gray-500">已结束</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {room.participantCount}人
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {room.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLeaveRoom}
                className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-white">{activeRoom.name}</h2>
                <p className="text-sm text-gray-500">{activeRoom.participantCount}人在会议中</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-danger-500/20 text-danger-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
                会议进行中
              </span>
              <span className="text-sm text-gray-400 font-mono">00:25:30</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
            <div className="col-span-9 glass-card p-4 flex flex-col">
              <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3">
                {activeRoom.participants.map((p: any, index: number) => (
                  <div
                    key={index}
                    className="relative bg-dark-800 rounded-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-medium mx-auto mb-2">
                          {p.name.charAt(0)}
                        </div>
                        <p className="text-sm text-white">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.org}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-xs text-white/80 bg-black/50 px-2 py-0.5 rounded">
                        {p.name}
                      </span>
                      <Mic size={14} className="text-success-400" />
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 left-2">
                        <span className="text-xs text-white bg-primary-500/80 px-2 py-0.5 rounded">
                          主持人
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                <button className="p-3 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-colors">
                  <Mic size={20} />
                </button>
                <button className="p-3 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-colors">
                  <Video size={20} />
                </button>
                <button className="p-3 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-colors">
                  <Monitor size={20} />
                </button>
                <button className="p-3 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-colors">
                  <MessageSquare size={20} />
                </button>
                <button
                  onClick={handleLeaveRoom}
                  className="p-3 bg-danger-500 text-white rounded-full hover:bg-danger-400 transition-colors"
                >
                  <PhoneOff size={20} />
                </button>
              </div>
            </div>

            <div className="col-span-3 glass-card flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-medium text-white">参会人员</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {activeRoom.participants.map((p: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                        {p.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success-500 border-2 border-dark-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500 truncate">{p.org}</p>
                    </div>
                    <Mic size={14} className="text-success-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-[480px] p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">创建会商</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">会议主题</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  placeholder="请输入会议主题"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">会议类型</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 rounded-lg border border-primary-500/50 bg-primary-500/10 text-center">
                    <Video size={24} className="mx-auto text-primary-400 mb-2" />
                    <p className="text-sm text-white">视频会商</p>
                  </button>
                  <button className="p-4 rounded-lg border border-white/10 bg-white/5 text-center hover:bg-white/10 transition-colors">
                    <Phone size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">语音会商</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">邀请参会人</label>
                <div className="max-h-40 overflow-y-auto space-y-1 border border-white/10 rounded-lg p-2">
                  {users.slice(0, 6).map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer"
                    >
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-300">{user.realName}</span>
                      <span className="text-xs text-gray-500">- {user.orgName}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 btn-secondary text-sm"
              >
                取消
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 btn-primary text-sm"
              >
                创建并开始
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
