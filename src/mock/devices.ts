import type { Device } from '@/types';

const manufacturers = ['海康威视', '大华股份', '宇视科技', '华为', '天地伟业'];
const models = ['DS-2CD3T46WD-I3', 'IPC-HFW2431M-S', 'IPC-B214-IR', 'D2140-10-I-P', 'TI-ND224'];
const resolutions = ['1920x1080', '2560x1440', '3840x2160', '1280x720'];

function generateDevices(): Device[] {
  const devices: Device[] = [];
  const orgIds = [
    'org-001', 'org-002', 'org-003', 'org-004', 'org-005',
    'org-006', 'org-007', 'org-008', 'org-009', 'org-010',
    'org-011', 'org-012', 'org-013', 'org-014', 'org-015', 'org-016'
  ];

  const deviceNames = [
    '大门口', '后门', '停车场入口', '停车场出口', '大厅',
    '走廊东', '走廊西', '电梯间', '楼梯间', '会议室',
    '办公室区', '财务室', '机房', '仓库', '消防通道',
    '周界东', '周界西', '周界南', '周界北', '主通道'
  ];

  const statuses: Array<'online' | 'offline' | 'warning'> = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'warning', 'offline'];

  let id = 1;
  orgIds.forEach((orgId, orgIndex) => {
    const count = 8 + Math.floor(Math.random() * 12);
    for (let i = 0; i < count; i++) {
      const nameIndex = (id - 1) % deviceNames.length;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const lat = 39.9 + Math.random() * 0.5;
      const lng = 116.3 + Math.random() * 0.5;

      devices.push({
        id: `dev-${String(id).padStart(4, '0')}`,
        name: `${deviceNames[nameIndex]}摄像机${i + 1}`,
        code: `CAM-${orgIndex + 1}-${String(i + 1).padStart(3, '0')}`,
        type: 'camera',
        status,
        location: {
          lat,
          lng,
          address: `地址${id}号`,
        },
        orgId,
        manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
        model: models[Math.floor(Math.random() * models.length)],
        ip: `192.168.${orgIndex + 1}.${100 + i}`,
        port: 554,
        resolution: resolutions[Math.floor(Math.random() * resolutions.length)],
        hasPTZ: Math.random() > 0.7,
        createTime: `2024-0${(id % 9) + 1}-${String((id % 28) + 1).padStart(2, '0')} 10:00:00`,
        lastOnlineTime: status === 'offline' ? `2024-06-1${(id % 9)} 08:30:00` : '2024-06-16 09:00:00',
      });
      id++;
    }
  });

  return devices;
}

export const devices: Device[] = generateDevices();

export function getDeviceById(id: string): Device | undefined {
  return devices.find((d) => d.id === id);
}

export function getDevicesByOrg(orgId: string): Device[] {
  return devices.filter((d) => d.orgId === orgId);
}

export function getDevicesByStatus(status: Device['status']): Device[] {
  return devices.filter((d) => d.status === status);
}

export function searchDevices(keyword: string): Device[] {
  const lower = keyword.toLowerCase();
  return devices.filter(
    (d) =>
      d.name.toLowerCase().includes(lower) ||
      d.code.toLowerCase().includes(lower) ||
      d.ip.includes(keyword)
  );
}
