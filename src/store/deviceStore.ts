import { create } from 'zustand';
import type { Device } from '@/types';
import { devices as mockDevices, getDeviceById, getDevicesByOrg, searchDevices } from '@/mock';
import { organizations } from '@/mock';

const getChildOrgIds = (parentId: string): string[] => {
  const result: string[] = [parentId];
  const children = organizations.filter(o => o.parentId === parentId);
  children.forEach(child => {
    result.push(...getChildOrgIds(child.id));
  });
  return result;
};

interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  loading: boolean;
  
  searchKeyword: string;
  statusFilter: Device['status'] | 'all';
  orgFilter: string;
  
  fetchDevices: () => void;
  setSelectedDevice: (device: Device | null) => void;
  setSearchKeyword: (keyword: string) => void;
  setStatusFilter: (status: Device['status'] | 'all') => void;
  setOrgFilter: (orgId: string) => void;
  
  getFilteredDevices: () => Device[];
  getDeviceCount: () => { total: number; online: number; offline: number; warning: number };
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: [],
  selectedDevice: null,
  loading: false,
  
  searchKeyword: '',
  statusFilter: 'all',
  orgFilter: '',
  
  fetchDevices: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ devices: mockDevices, loading: false });
    }, 300);
  },
  
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  setOrgFilter: (orgId) => set({ orgFilter: orgId }),
  
  getFilteredDevices: () => {
    const { devices, searchKeyword, statusFilter, orgFilter } = get();
    let filtered = [...devices];
    
    if (searchKeyword) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          d.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          d.ip.includes(searchKeyword)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }
    
    if (orgFilter) {
      const orgIds = getChildOrgIds(orgFilter);
      filtered = filtered.filter((d) => orgIds.includes(d.orgId));
    }
    
    return filtered;
  },
  
  getDeviceCount: () => {
    const { devices } = get();
    return {
      total: devices.length,
      online: devices.filter((d) => d.status === 'online').length,
      offline: devices.filter((d) => d.status === 'offline').length,
      warning: devices.filter((d) => d.status === 'warning').length,
    };
  },
}));
