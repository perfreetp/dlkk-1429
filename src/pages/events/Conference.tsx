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
  Check,
} from 'lucide-react';
import type { User } from '@/types';

interface Participant {
  userId: string;
  userName: string;
  orgName: string;
  role: string;
}

interface ConferenceRoom {
  id: string;
  name: string;
  creator: string;
  creatorId: string;
  createTime: string;
  status: 'ongoing' | 'ended';
  participantCount: number;
  participants: Participant[];
  duration?: string;
}

export default function Conference() {
  const { setCurrentPageTitle } = useUiStore();
  const { users, fetchUsers } = useUserStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeRoom, setActiveRoom] = useState<ConferenceRoom | null>(null);
  const [rooms, setRooms] = useState<ConferenceRoom[]>([
    {
      id: 'room-001',
      name: '火车站区域应急会商',
      creator: '张建国',
      creatorId: 'user-001',
      createTime: '2024-06-16 09:30:00',
      status: 'ongoing',
      participantCount: 6,
      participants: [
        { userId: 'user-001', userName: '张建国', orgName: '市级综治中心', role: '主持人' },
        { userId: 'user-002', userName: '李美玲', orgName: '东城区综治中心', role: '参会人' },
        { userId: 'user-003', userName: '王志强', orgName: '南城区综治中心', role: '参会人' },
        { userId: 'user-004', userName: '赵明华', orgName: '市公安局', role: '参会人' },
        { userId: 'user-005', userName: '孙晓峰', orgName: '消防支队', role: '参会人' },
        { userId: 'user-006', userName: '周文涛', orgName: '应急管理局', role: '参会人' },
      ],
    },
    {
      id: 'room-002',
      name: '日常值班例会',
      creator: '李美玲',
      creatorId: 'user-002',
      createTime: '2024-06-16 08:00:00',
      status: 'ended',
      participantCount: 4,
      duration: '1小时30分',
      participants: [
        { userId: 'user-002', userName: '李美玲', orgName: '东城区综治中心', role: '主持人' },
        { userId: 'user-003', userName: '王志强', orgName: '南城区综治中心', role: '参会人' },
        { userId: 'user-007', userName: '刘芳', orgName: '西城区综治中心', role: '参会人' },
        { userId: 'user-008', userName: '陈刚', orgName: '北城区综治中心', role: '参会人' },
      ],
    },
    {
      id: 'room-003',
      name: '中心医院安保协调会',
      creator: '王志强',
      creatorId: 'user-003',
      createTime: '2024-06-15 14:00:00',
      status: 'ended',
      participantCount: 5,
      duration: '45分钟',
      participants: [
        { userId: 'user-003', userName: '王志强', orgName: '南城区综治中心', role: '主持人' },
        { userId: 'user-001', userName: '张建国', orgName: '市级综治中心', role: '参会人' },
        { userId: 'user-009', userName: '杨静', orgName: '中心医院', role: '参会人' },
        { userId: 'user-010', userName: '黄磊', orgName: '辖区派出所', role: '参会人' },
        { userId: 'user-004', userName: '赵明华', orgName: '市公安局', role: '参会人' },
      ],
    },
  ]);

  const [createForm, setCreateForm] = useState({
    name: '',
    type: 'video' as 'video' | 'audio',
    selectedUsers: [] as string[],
  });

  const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set());
  const [videoOffUsers, setVideoOffUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCurrentPageTitle('会商中心');
    fetchUsers();
  }, [setCurrentPageTitle, fetchUsers]);

  const handleJoinRoom = (room: ConferenceRoom) => {
    setActiveRoom(room);
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
  };

  const toggleUserMute = (userId: string) => {
    setMutedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const toggleUserVideo = (userId: string) => {
    setVideoOffUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleCreateRoom = () => {
    if (!createForm.name || createForm.selectedUsers.length === 0) return;

    const currentUser = users[0];
    const selectedParticipants: Participant[] = [
      {
        userId: currentUser.id,
        userName: currentUser.realName,
        orgName: currentUser.orgName,
        role: '主持人',
      },
      ...createForm.selectedUsers.map(userId => {
        const user = users.find(u => u.id === userId);
        return {
          userId,
          userName: user?.realName || '',
          orgName: user?.orgName || '',
          role: '参会人',
        };
      }),
    ];

    const newRoom: ConferenceRoom = {
      id: `room-${Date.now()}`,
      name: createForm.name,
      creator: currentUser.realName,
      creatorId: currentUser.id,
      createTime: new Date().toLocaleString('zh-CN'),
      status: 'ongoing',
      participantCount: selectedParticipants.length,
      participants: selectedParticipants,
    };

    setRooms(prev => [newRoom, ...prev]);
    setActiveRoom(newRoom);
    setShowCreateModal(false);
    setCreateForm({ name: '', type: 'video', selectedUsers: [] });
    setMutedUsers(new Set());
    setVideoOffUsers(new Set());
  };

  const toggleUserSelection = (userId: string) => {
    setCreateForm(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId],
    }));
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {!activeRoom ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">会商会议</h2>
            <button
              onClick={() => {
                setCreateForm({ name: '', type: 'video', selectedUsers: [] });
                setShowCreateModal(true);
              }}
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
                            {p.userName.charAt(0)}
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
                {rooms.filter(r => r.status === 'ongoing').length === 0 && (
                  <div className="py-12 text-center">
                    <Video size={48} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-500">暂无进行中的会议</p>
                  </div>
                )}
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
                {activeRoom.participants.map((p, index) => (
                  <div
                    key={p.userId}
                    className="relative bg-dark-800 rounded-lg overflow-hidden"
                  >
                    {videoOffUsers.has(p.userId) ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-medium mx-auto mb-2">
                            {p.userName.charAt(0)}
                          </div>
                          <p className="text-sm text-white">{p.userName}</p>
                          <p className="text-xs text-gray-500">{p.orgName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-medium mx-auto mb-2">
                            {p.userName.charAt(0)}
                          </div>
                          <p className="text-sm text-white">{p.userName}</p>
                          <p className="text-xs text-gray-500">{p.orgName}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-xs text-white/80 bg-black/50 px-2 py-0.5 rounded">
                        {p.userName}
                      </span>
                      {mutedUsers.has(p.userId) ? (
                        <MicOff size={14} className="text-danger-400" />
                      ) : (
                        <Mic size={14} className="text-success-400" />
                      )}
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
                <button
                  onClick={() => toggleUserMute('user-001')}
                  className={`p-3 rounded-full transition-colors ${
                    mutedUsers.has('user-001')
                      ? 'bg-danger-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {mutedUsers.has('user-001') ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button
                  onClick={() => toggleUserVideo('user-001')}
                  className={`p-3 rounded-full transition-colors ${
                    videoOffUsers.has('user-001')
                      ? 'bg-danger-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {videoOffUsers.has('user-001') ? <VideoOff size={20} /> : <Video size={20} />}
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
                {activeRoom.participants.map((p) => (
                  <div
                    key={p.userId}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                        {p.userName.charAt(0)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success-500 border-2 border-dark-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">{p.userName}</p>
                      <p className="text-xs text-gray-500 truncate">{p.orgName}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {mutedUsers.has(p.userId) ? (
                        <MicOff size={14} className="text-danger-400" />
                      ) : (
                        <Mic size={14} className="text-success-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-[480px] p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">创建会商</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">会议主题</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  placeholder="请输入会议主题"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">会议类型</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCreateForm({ ...createForm, type: 'video' })}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      createForm.type === 'video'
                        ? 'border-primary-500/50 bg-primary-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Video
                      size={24}
                      className={`mx-auto mb-2 ${
                        createForm.type === 'video' ? 'text-primary-400' : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        createForm.type === 'video' ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      视频会商
                    </p>
                    {createForm.type === 'video' && (
                      <div className="absolute top-2 right-2">
                        <Check size={16} className="text-primary-400" />
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => setCreateForm({ ...createForm, type: 'audio' })}
                    className={`p-4 rounded-lg border text-center transition-colors relative ${
                      createForm.type === 'audio'
                        ? 'border-primary-500/50 bg-primary-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Phone
                      size={24}
                      className={`mx-auto mb-2 ${
                        createForm.type === 'audio' ? 'text-primary-400' : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        createForm.type === 'audio' ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      语音会商
                    </p>
                    {createForm.type === 'audio' && (
                      <div className="absolute top-2 right-2">
                        <Check size={16} className="text-primary-400" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  邀请参会人 ({createForm.selectedUsers.length}人已选)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1 border border-white/10 rounded-lg p-2">
                  {users.slice(0, 8).map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={createForm.selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                        />
                        <div
                          className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                            createForm.selectedUsers.includes(user.id)
                              ? 'bg-primary-500 border-primary-500'
                              : 'border-gray-600 bg-dark-700'
                          }`}
                        >
                          {createForm.selectedUsers.includes(user.id) && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs">
                          {user.realName.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-300">{user.realName}</span>
                        <span className="text-xs text-gray-500">- {user.orgName}</span>
                      </div>
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
                onClick={handleCreateRoom}
                disabled={!createForm.name || createForm.selectedUsers.length === 0}
                className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
