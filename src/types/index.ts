export interface Device {
  id: string;
  name: string;
  code: string;
  type: 'camera' | 'nvr' | 'encoder';
  status: 'online' | 'offline' | 'warning';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  orgId: string;
  groupId?: string;
  manufacturer: string;
  model: string;
  ip: string;
  port: number;
  resolution: string;
  hasPTZ: boolean;
  createTime: string;
  lastOnlineTime: string;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  level: 1 | 2 | 3 | 4;
  parentId: string | null;
  sort: number;
  contact: string;
  phone: string;
  address: string;
  deviceCount: number;
  onlineCount: number;
  children?: Organization[];
}

export interface Alarm {
  id: string;
  title: string;
  type: 'intrusion' | 'fire' | 'offline' | 'fault' | 'other';
  level: 'critical' | 'major' | 'minor' | 'tip';
  status: 'pending' | 'processing' | 'dispatched' | 'closed';
  deviceId: string;
  deviceName: string;
  orgId: string;
  orgName: string;
  description: string;
  imageUrl?: string;
  createTime: string;
  confirmTime?: string;
  dispatchTime?: string;
  closeTime?: string;
  handler?: string;
  handlerOrg?: string;
  handleResult?: string;
}

export interface User {
  id: string;
  username: string;
  realName: string;
  avatar?: string;
  phone: string;
  email?: string;
  roleId: string;
  roleName: string;
  orgId: string;
  orgName: string;
  status: 'active' | 'disabled';
  lastLoginTime?: string;
  createTime: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  sort: number;
  status: 'active' | 'disabled';
  createTime: string;
}

export interface HandoverRecord {
  id: string;
  shiftType: 'day' | 'night';
  onDutyUserId: string;
  onDutyUserName: string;
  offDutyUserId: string;
  offDutyUserName: string;
  handoverTime: string;
  pendingMatters: string;
  importantEvents: string;
  remarks: string;
  status: 'completed' | 'pending';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  orgName: string;
  module: string;
  action: string;
  description: string;
  ip: string;
  userAgent: string;
  createTime: string;
  result: 'success' | 'fail';
}

export interface DeviceGroup {
  id: string;
  name: string;
  parentId: string | null;
  orgId: string;
  deviceCount: number;
  sort: number;
  description?: string;
  children?: DeviceGroup[];
}

export interface ConferenceRoom {
  id: string;
  name: string;
  creatorId: string;
  creatorName: string;
  createTime: string;
  status: 'ongoing' | 'ended';
  participantCount: number;
  participants: {
    userId: string;
    userName: string;
    orgName: string;
    joinTime: string;
  }[];
}

export interface VideoWallLayout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  cells: {
    index: number;
    deviceId?: string;
    deviceName?: string;
  }[];
}

export interface StatisticsOverview {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  onlineRate: number;
  todayAlarms: number;
  pendingAlarms: number;
  processingAlarms: number;
  closedAlarms: number;
  totalOrgs: number;
  totalUsers: number;
  onlineUsers: number;
}

export interface MenuItem {
  key: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
}
