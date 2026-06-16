import { create } from 'zustand';
import type { Organization } from '@/types';
import { getOrgTree, organizations } from '@/mock';

interface OrgState {
  orgTree: Organization[];
  orgList: Organization[];
  selectedOrgId: string;
  expandedOrgs: Set<string>;
  loading: boolean;
  
  fetchOrgTree: () => void;
  setSelectedOrg: (orgId: string) => void;
  toggleOrgExpanded: (orgId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  
  getOrgById: (id: string) => Organization | undefined;
  getChildOrgs: (parentId: string) => Organization[];
}

export const useOrgStore = create<OrgState>((set, get) => ({
  orgTree: [],
  orgList: [],
  selectedOrgId: '',
  expandedOrgs: new Set(),
  loading: false,
  
  fetchOrgTree: () => {
    set({ loading: true });
    setTimeout(() => {
      const tree = getOrgTree();
      const allIds = new Set(organizations.map((o) => o.id));
      set({
        orgTree: tree,
        orgList: organizations,
        expandedOrgs: allIds,
        loading: false,
      });
    }, 300);
  },
  
  setSelectedOrg: (orgId) => set({ selectedOrgId: orgId }),
  
  toggleOrgExpanded: (orgId) =>
    set((state) => {
      const newExpanded = new Set(state.expandedOrgs);
      if (newExpanded.has(orgId)) {
        newExpanded.delete(orgId);
      } else {
        newExpanded.add(orgId);
      }
      return { expandedOrgs: newExpanded };
    }),
  
  expandAll: () => {
    const allIds = new Set(get().orgList.map((o) => o.id));
    set({ expandedOrgs: allIds });
  },
  
  collapseAll: () => set({ expandedOrgs: new Set() }),
  
  getOrgById: (id) => organizations.find((o) => o.id === id),
  
  getChildOrgs: (parentId) => organizations.filter((o) => o.parentId === parentId),
}));
