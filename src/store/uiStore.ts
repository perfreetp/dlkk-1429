import { create } from 'zustand';

interface UiState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  currentPageTitle: string;
  setCurrentPageTitle: (title: string) => void;
  
  showAlarmPanel: boolean;
  setShowAlarmPanel: (show: boolean) => void;
  toggleAlarmPanel: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  currentPageTitle: '总览驾驶舱',
  setCurrentPageTitle: (title) => set({ currentPageTitle: title }),
  
  showAlarmPanel: false,
  setShowAlarmPanel: (show) => set({ showAlarmPanel: show }),
  toggleAlarmPanel: () => set((state) => ({ showAlarmPanel: !state.showAlarmPanel })),
}));
