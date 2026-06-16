import type { Organization } from '@/types';

export const organizations: Organization[] = [
  {
    id: 'org-001',
    name: '市级综治中心',
    code: 'SZ-ZZZX',
    level: 1,
    parentId: null,
    sort: 1,
    contact: '张主任',
    phone: '13800000001',
    address: '市政中心A座',
    deviceCount: 128,
    onlineCount: 120,
  },
  {
    id: 'org-002',
    name: '东城区综治中心',
    code: 'DC-ZZZX',
    level: 2,
    parentId: 'org-001',
    sort: 1,
    contact: '李主任',
    phone: '13800000002',
    address: '东城区政府大楼',
    deviceCount: 256,
    onlineCount: 245,
  },
  {
    id: 'org-003',
    name: '西城区综治中心',
    code: 'XC-ZZZX',
    level: 2,
    parentId: 'org-001',
    sort: 2,
    contact: '王主任',
    phone: '13800000003',
    address: '西城区政务中心',
    deviceCount: 198,
    onlineCount: 189,
  },
  {
    id: 'org-004',
    name: '南城区综治中心',
    code: 'NC-ZZZX',
    level: 2,
    parentId: 'org-001',
    sort: 3,
    contact: '赵主任',
    phone: '13800000004',
    address: '南城区行政中心',
    deviceCount: 312,
    onlineCount: 298,
  },
  {
    id: 'org-005',
    name: '北城区综治中心',
    code: 'BC-ZZZX',
    level: 2,
    parentId: 'org-001',
    sort: 4,
    contact: '孙主任',
    phone: '13800000005',
    address: '北城区市民中心',
    deviceCount: 176,
    onlineCount: 168,
  },
  {
    id: 'org-006',
    name: '和平街道办',
    code: 'HP-JDB',
    level: 3,
    parentId: 'org-002',
    sort: 1,
    contact: '刘主任',
    phone: '13800000006',
    address: '和平路88号',
    deviceCount: 64,
    onlineCount: 62,
  },
  {
    id: 'org-007',
    name: '解放路街道办',
    code: 'JFL-JDB',
    level: 3,
    parentId: 'org-002',
    sort: 2,
    contact: '周主任',
    phone: '13800000007',
    address: '解放路156号',
    deviceCount: 72,
    onlineCount: 68,
  },
  {
    id: 'org-008',
    name: '中山路街道办',
    code: 'ZSL-JDB',
    level: 3,
    parentId: 'org-003',
    sort: 1,
    contact: '吴主任',
    phone: '13800000008',
    address: '中山路234号',
    deviceCount: 56,
    onlineCount: 54,
  },
  {
    id: 'org-009',
    name: '人民广场街道办',
    code: 'RMGC-JDB',
    level: 3,
    parentId: 'org-003',
    sort: 2,
    contact: '郑主任',
    phone: '13800000009',
    address: '人民广场东侧',
    deviceCount: 48,
    onlineCount: 46,
  },
  {
    id: 'org-010',
    name: '火车站广场街道办',
    code: 'HCZGC-JDB',
    level: 3,
    parentId: 'org-004',
    sort: 1,
    contact: '冯主任',
    phone: '13800000010',
    address: '火车站广场',
    deviceCount: 88,
    onlineCount: 85,
  },
  {
    id: 'org-011',
    name: '开发区街道办',
    code: 'KFQ-JDB',
    level: 3,
    parentId: 'org-004',
    sort: 2,
    contact: '陈主任',
    phone: '13800000011',
    address: '经济开发区',
    deviceCount: 96,
    onlineCount: 92,
  },
  {
    id: 'org-012',
    name: '大学城街道办',
    code: 'DXC-JDB',
    level: 3,
    parentId: 'org-005',
    sort: 1,
    contact: '褚主任',
    phone: '13800000012',
    address: '大学城园区',
    deviceCount: 52,
    onlineCount: 50,
  },
  {
    id: 'org-013',
    name: '市政府',
    code: 'SZF',
    level: 4,
    parentId: 'org-001',
    sort: 1,
    contact: '保安队长',
    phone: '13800000013',
    address: '市政中心',
    deviceCount: 32,
    onlineCount: 32,
  },
  {
    id: 'org-014',
    name: '市公安局',
    code: 'SGAJ',
    level: 4,
    parentId: 'org-001',
    sort: 2,
    contact: '指挥中心',
    phone: '13800000014',
    address: '公安大楼',
    deviceCount: 48,
    onlineCount: 47,
  },
  {
    id: 'org-015',
    name: '市民中心',
    code: 'SMZX',
    level: 4,
    parentId: 'org-002',
    sort: 1,
    contact: '物业经理',
    phone: '13800000015',
    address: '东城区市民中心',
    deviceCount: 24,
    onlineCount: 23,
  },
  {
    id: 'org-016',
    name: '中心医院',
    code: 'ZXYY',
    level: 4,
    parentId: 'org-003',
    sort: 1,
    contact: '保卫科',
    phone: '13800000016',
    address: '中心医院院区',
    deviceCount: 56,
    onlineCount: 54,
  },
];

export function getOrgTree(): Organization[] {
  const orgMap = new Map<string, Organization>();
  const roots: Organization[] = [];

  organizations.forEach((org) => {
    orgMap.set(org.id, { ...org, children: [] });
  });

  orgMap.forEach((org) => {
    if (org.parentId) {
      const parent = orgMap.get(org.parentId);
      if (parent && parent.children) {
        parent.children.push(org);
      }
    } else {
      roots.push(org);
    }
  });

  const sortOrgs = (orgs: Organization[]) => {
    orgs.sort((a, b) => a.sort - b.sort);
    orgs.forEach((org) => {
      if (org.children && org.children.length > 0) {
        sortOrgs(org.children);
      }
    });
  };

  sortOrgs(roots);
  return roots;
}

export function getOrgById(id: string): Organization | undefined {
  return organizations.find((org) => org.id === id);
}

export function getChildOrgs(parentId: string): Organization[] {
  return organizations.filter((org) => org.parentId === parentId);
}
