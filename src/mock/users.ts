import type { User, Role, HandoverRecord, AuditLog } from '@/types';

export const roles: Role[] = [
  {
    id: 'role-001',
    name: '超级管理员',
    code: 'super_admin',
    description: '系统最高权限，可进行所有操作',
    permissions: ['*'],
    sort: 1,
    status: 'active',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 'role-002',
    name: '市级值班员',
    code: 'city_operator',
    description: '市级综治中心值班人员，拥有全域视频查看和告警处置权限',
    permissions: [
      'dashboard:view',
      'device:view',
      'device:control',
      'alarm:view',
      'alarm:handle',
      'conference:create',
      'report:view',
      'wall:control',
    ],
    sort: 2,
    status: 'active',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 'role-003',
    name: '区级值班员',
    code: 'district_operator',
    description: '区级综治中心值班人员，仅可查看本辖区资源',
    permissions: [
      'dashboard:view',
      'device:view',
      'alarm:view',
      'alarm:handle',
      'report:view',
    ],
    sort: 3,
    status: 'active',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 'role-004',
    name: '街道操作员',
    code: 'street_operator',
    description: '街道级操作人员，可查看本街道设备',
    permissions: ['device:view', 'alarm:view'],
    sort: 4,
    status: 'active',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 'role-005',
    name: '重点单位操作员',
    code: 'unit_operator',
    description: '重点单位操作人员，管理本单位视频资源',
    permissions: ['device:view', 'device:manage'],
    sort: 5,
    status: 'active',
    createTime: '2024-01-01 00:00:00',
  },
];

const userNames = [
  { realName: '张建国', username: 'zhangjg' },
  { realName: '李美玲', username: 'liml' },
  { realName: '王志强', username: 'wangzq' },
  { realName: '赵丽华', username: 'zhaolh' },
  { realName: '刘海峰', username: 'liuhf' },
  { realName: '陈静怡', username: 'chenjy' },
  { realName: '杨光远', username: 'yanggy' },
  { realName: '周文涛', username: 'zhouwt' },
  { realName: '吴晓燕', username: 'wuxy' },
  { realName: '郑浩然', username: 'zhenghr' },
];

const orgIds = [
  { id: 'org-001', name: '市级综治中心' },
  { id: 'org-002', name: '东城区综治中心' },
  { id: 'org-003', name: '西城区综治中心' },
  { id: 'org-004', name: '南城区综治中心' },
  { id: 'org-005', name: '北城区综治中心' },
];

const roleIds = [
  { id: 'role-001', name: '超级管理员' },
  { id: 'role-002', name: '市级值班员' },
  { id: 'role-003', name: '区级值班员' },
];

export const users: User[] = userNames.map((u, i) => {
  const orgIndex = Math.min(i, orgIds.length - 1);
  const roleIndex = i === 0 ? 0 : i < 3 ? 1 : 2;

  return {
    id: `user-${String(i + 1).padStart(3, '0')}`,
    username: u.username,
    realName: u.realName,
    phone: `138${String(10000000 + i * 137).slice(0, 8)}`,
    email: `${u.username}@example.com`,
    roleId: roleIds[roleIndex].id,
    roleName: roleIds[roleIndex].name,
    orgId: orgIds[orgIndex].id,
    orgName: orgIds[orgIndex].name,
    status: i < 8 ? 'active' : 'disabled',
    lastLoginTime: i < 5
      ? `2024-06-16 0${i + 8}:${String(30 + i * 5).padStart(2, '0')}:00`
      : undefined,
    createTime: `2024-01-${String(i + 1).padStart(2, '0')} 09:00:00`,
  };
});

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUsersByOrg(orgId: string): User[] {
  return users.filter((u) => u.orgId === orgId);
}

// 值班交接记录
const handoverReasons = [
  '正常交接班',
  '临时换班',
  '会议调班',
];

export const handoverRecords: HandoverRecord[] = Array.from({ length: 20 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);

  return {
    id: `handover-${String(20 - i).padStart(5, '0')}`,
    shiftType: i % 2 === 0 ? 'day' : 'night',
    onDutyUserId: `user-${String((i % 5) + 1).padStart(3, '0')}`,
    onDutyUserName: userNames[(i % 5) + 1 < userNames.length ? (i % 5) + 1 : 0].realName,
    offDutyUserId: `user-${String(((i + 2) % 5) + 1).padStart(3, '0')}`,
    offDutyUserName: userNames[((i + 2) % 5)].realName,
    handoverTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${i % 2 === 0 ? '08:30' : '20:30'}:00`,
    pendingMatters: i === 0 ? '1. 处理火车站区域告警\n2. 检查东城区设备离线问题' : '无重大待办事项',
    importantEvents: i === 0 ? '今日共接报告警23起，已处置20起' : '值班期间运行正常',
    remarks: handoverReasons[i % handoverReasons.length],
    status: 'completed',
  };
});

// 操作审计日志
const modules = ['资源接入', '级联管理', '告警管理', '用户管理', '系统设置', '视频上墙', '统计报表'];
const actions = ['新增', '修改', '删除', '查看', '导出', '登录', '登出', '配置'];
const results: Array<'success' | 'fail'> = ['success', 'success', 'success', 'success', 'fail'];

export const auditLogs: AuditLog[] = Array.from({ length: 50 }, (_, i) => {
  const date = new Date();
  date.setHours(date.getHours() - i * 2);

  const user = userNames[i % userNames.length];
  const module = modules[i % modules.length];
  const action = actions[i % actions.length];

  return {
    id: `audit-${String(50 - i).padStart(6, '0')}`,
    userId: `user-${String((i % 5) + 1).padStart(3, '0')}`,
    userName: user.realName,
    orgName: orgIds[i % orgIds.length].name,
    module,
    action,
    description: `${user.realName}${action}了${module}模块`,
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Chrome/125.0.0.0 Windows NT 10.0',
    createTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`,
    result: results[i % results.length],
  };
});
