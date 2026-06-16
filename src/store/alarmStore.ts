import { create } from 'zustand';
import type { Alarm } from '@/types';
import { alarms as mockAlarms, getAlarmById } from '@/mock';

interface AlarmState {
  alarms: Alarm[];
  selectedAlarm: Alarm | null;
  loading: boolean;
  
  levelFilter: Alarm['level'] | 'all';
  statusFilter: Alarm['status'] | 'all';
  timeRange: string;
  
  fetchAlarms: () => void;
  setSelectedAlarm: (alarm: Alarm | null) => void;
  setLevelFilter: (level: Alarm['level'] | 'all') => void;
  setStatusFilter: (status: Alarm['status'] | 'all') => void;
  setTimeRange: (range: string) => void;
  
  confirmAlarm: (id: string) => void;
  dispatchAlarm: (id: string, handler: string, handlerOrg: string) => void;
  closeAlarm: (id: string, result: string) => void;
  
  getFilteredAlarms: () => Alarm[];
  getAlarmStats: () => {
    total: number;
    pending: number;
    processing: number;
    dispatched: number;
    closed: number;
    critical: number;
    major: number;
    minor: number;
    tip: number;
  };
}

export const useAlarmStore = create<AlarmState>((set, get) => ({
  alarms: [],
  selectedAlarm: null,
  loading: false,
  
  levelFilter: 'all',
  statusFilter: 'all',
  timeRange: 'today',
  
  fetchAlarms: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ alarms: mockAlarms, loading: false });
    }, 300);
  },
  
  setSelectedAlarm: (alarm) => set({ selectedAlarm: alarm }),
  
  setLevelFilter: (level) => set({ levelFilter: level }),
  
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  setTimeRange: (range) => set({ timeRange: range }),
  
  confirmAlarm: (id) => {
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'processing',
              confirmTime: new Date().toISOString(),
            }
          : a
      ),
    }));
  },
  
  dispatchAlarm: (id, handler, handlerOrg) => {
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'dispatched',
              dispatchTime: new Date().toISOString(),
              handler,
              handlerOrg,
            }
          : a
      ),
    }));
  },
  
  closeAlarm: (id, result) => {
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'closed',
              closeTime: new Date().toISOString(),
              handleResult: result,
            }
          : a
      ),
    }));
  },
  
  getFilteredAlarms: () => {
    const { alarms, levelFilter, statusFilter } = get();
    let filtered = [...alarms];
    
    if (levelFilter !== 'all') {
      filtered = filtered.filter((a) => a.level === levelFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    
    return filtered;
  },
  
  getAlarmStats: () => {
    const { alarms } = get();
    return {
      total: alarms.length,
      pending: alarms.filter((a) => a.status === 'pending').length,
      processing: alarms.filter((a) => a.status === 'processing').length,
      dispatched: alarms.filter((a) => a.status === 'dispatched').length,
      closed: alarms.filter((a) => a.status === 'closed').length,
      critical: alarms.filter((a) => a.level === 'critical').length,
      major: alarms.filter((a) => a.level === 'major').length,
      minor: alarms.filter((a) => a.level === 'minor').length,
      tip: alarms.filter((a) => a.level === 'tip').length,
    };
  },
}));
