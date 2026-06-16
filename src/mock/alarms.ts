import type { Alarm } from '@/types';

const alarmTypes: Array<{ type: Alarm['type']; titles: string[] }> = [
  {
    type: 'intrusion',
    titles: ['非法入侵检测', '周界入侵报警', '区域闯入告警', '翻越围栏检测'],
  },
  {
    type: 'fire',
    titles: ['烟雾检测告警', '火焰检测报警', '消防通道占用', '灭火器异常'],
  },
  {
    type: 'offline',
    titles: ['设备离线告警', '视频信号丢失', '网络中断告警', '设备断电告警'],
  },
  {
    type: 'fault',
    titles: ['设备故障告警', '存储异常告警', '硬盘容量告警', '视频质量异常'],
  },
  {
    type: 'other',
    titles: ['遗留物检测', '人群聚集告警', '快速移动检测', '异常行为检测'],
  },
];

const levels: Array<Alarm['level']> = ['critical', 'major', 'minor', 'tip'];
const statuses: Array<Alarm['status']> = ['pending', 'processing', 'dispatched', 'closed'];

const orgs = [
  { id: 'org-002', name: '东城区综治中心' },
  { id: 'org-003', name: '西城区综治中心' },
  { id: 'org-004', name: '南城区综治中心' },
  { id: 'org-005', name: '北城区综治中心' },
  { id: 'org-006', name: '和平街道办' },
  { id: 'org-010', name: '火车站广场街道办' },
  { id: 'org-014', name: '市公安局' },
  { id: 'org-016', name: '中心医院' },
];

const handlers = ['张伟', '李娜', '王强', '赵敏', '刘洋'];

function generateAlarms(): Alarm[] {
  const alarms: Alarm[] = [];

  for (let i = 1; i <= 50; i++) {
    const typeGroup = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const org = orgs[Math.floor(Math.random() * orgs.length)];
    const deviceId = `dev-${String(Math.floor(Math.random() * 150) + 1).padStart(4, '0')}`;

    const createDate = new Date();
    createDate.setHours(createDate.getHours() - Math.floor(Math.random() * 48));

    const alarm: Alarm = {
      id: `alarm-${String(i).padStart(5, '0')}`,
      title: typeGroup.titles[Math.floor(Math.random() * typeGroup.titles.length)],
      type: typeGroup.type,
      level,
      status,
      deviceId,
      deviceName: `摄像机${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      orgId: org.id,
      orgName: org.name,
      description: `检测到异常情况，请及时处理。告警编号：ALM-${i}`,
      createTime: formatDate(createDate),
    };

    if (status !== 'pending') {
      alarm.confirmTime = formatDate(new Date(createDate.getTime() + 5 * 60 * 1000));
    }

    if (status === 'dispatched') {
      alarm.dispatchTime = formatDate(new Date(createDate.getTime() + 15 * 60 * 1000));
      alarm.handler = handlers[Math.floor(Math.random() * handlers.length)];
      alarm.handlerOrg = orgs[Math.floor(Math.random() * orgs.length)].name;
    }

    if (status === 'closed') {
      alarm.closeTime = formatDate(new Date(createDate.getTime() + 2 * 60 * 60 * 1000));
      alarm.handler = handlers[Math.floor(Math.random() * handlers.length)];
      alarm.handlerOrg = orgs[Math.floor(Math.random() * orgs.length)].name;
      alarm.handleResult = '已现场核实并处理完毕';
    }

    alarms.push(alarm);
  }

  return alarms.sort(
    (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  );
}

function formatDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export const alarms: Alarm[] = generateAlarms();

export function getAlarmById(id: string): Alarm | undefined {
  return alarms.find((a) => a.id === id);
}

export function getAlarmsByStatus(status: Alarm['status']): Alarm[] {
  return alarms.filter((a) => a.status === status);
}

export function getAlarmsByLevel(level: Alarm['level']): Alarm[] {
  return alarms.filter((a) => a.level === level);
}

export function getPendingAlarms(): Alarm[] {
  return alarms.filter((a) => a.status === 'pending' || a.status === 'processing');
}

export function getTodayAlarms(): Alarm[] {
  const today = new Date().toDateString();
  return alarms.filter((a) => new Date(a.createTime).toDateString() === today);
}
