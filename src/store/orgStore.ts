import { create } from 'zustand';
import type { Organization } from '@/types';
import { getOrgTree, organizations } from '@/mock';

let orgData = [...organizations];

const rebuildOrgTree = () => {
  const map = new Map<string, Organization>();
  const roots: Organization[] = [];
  
  orgData.forEach(org => {
    map.set(org.id, { ...org, children: [] });
  });
  
  orgData.forEach(org => {
    const node = map.get(org.id)!;
    if (org.parentId && map.has(org.parentId)) {
      const parent = map.get(org.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });
  
  const sortTree = (nodes: Organization[]): Organization[] => {
    return nodes
      .sort((a, b) => a.sort - b.sort)
      .map(node => ({
        ...node,
        children: node.children ? sortTree(node.children) : undefined,
      }));
  };
  
  return sortTree(roots);
};

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
  
  updateOrg: (id: string, data: Partial<Organization>) => void;
  addOrg: (parentId: string | null, data: Partial<Organization>) => void;
  deleteOrg: (id: string) => void;
  
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
      const tree = rebuildOrgTree();
      const allIds = new Set(orgData.map((o) => o.id));
      set({
        orgTree: tree,
        orgList: [...orgData],
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
  
  updateOrg: (id, data) => {
    orgData = orgData.map((o) =>
      o.id === id ? { ...o, ...data } : o
    );
    const tree = rebuildOrgTree();
    set({
      orgTree: tree,
      orgList: [...orgData],
    });
  },
  
  addOrg: (parentId, data) => {
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: data.name || '新组织',
      code: data.code || `ORG-${Date.now()}`,
      level: (parentId ? (orgData.find(o => o.id === parentId)?.level || 1) + 1 : 1) as 1 | 2 | 3 | 4,
      parentId: parentId,
      sort: data.sort || orgData.filter(o => o.parentId === parentId).length + 1,
      contact: data.contact || '',
      phone: data.phone || '',
      address: data.address || '',
      deviceCount: 0,
      onlineCount: 0,
    };
    orgData.push(newOrg);
    const tree = rebuildOrgTree();
    const newExpanded = new Set(get().expandedOrgs);
    if (parentId) newExpanded.add(parentId);
    newExpanded.add(newOrg.id);
    set({
      orgTree: tree,
      orgList: [...orgData],
      selectedOrgId: newOrg.id,
      expandedOrgs: newExpanded,
    });
  },
  
  deleteOrg: (id) => {
    const deleteRecursive = (orgId: string): string[] => {
      const children = orgData.filter(o => o.parentId === orgId);
      const deleted = [orgId];
      children.forEach(child => {
        deleted.push(...deleteRecursive(child.id));
      });
      return deleted;
    };
    const toDelete = deleteRecursive(id);
    orgData = orgData.filter(o => !toDelete.includes(o.id));
    const tree = rebuildOrgTree();
    const { selectedOrgId } = get();
    const newSelected = toDelete.includes(selectedOrgId) ? '' : selectedOrgId;
    set({
      orgTree: tree,
      orgList: [...orgData],
      selectedOrgId: newSelected,
    });
  },
  
  getOrgById: (id) => orgData.find((o) => o.id === id),
  
  getChildOrgs: (parentId) => orgData.filter((o) => o.parentId === parentId),
}));
