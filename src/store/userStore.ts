import { create } from 'zustand';
import type { User } from '@/types';
import { users as mockUsers, getUserById } from '@/mock';

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  
  fetchUsers: () => void;
  setCurrentUser: (user: User) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  users: [],
  loading: false,
  
  fetchUsers: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ users: mockUsers, loading: false });
    }, 300);
    
    if (!useUserStore.getState().currentUser && mockUsers.length > 0) {
      const admin = mockUsers.find(u => u.roleName === '超级管理员') || mockUsers[0];
      set({ currentUser: admin });
    }
  },
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  addUser: (user) => set((state) => ({
    users: [...state.users, user],
  })),
  
  updateUser: (user) => set((state) => ({
    users: state.users.map((u) => (u.id === user.id ? user : u)),
  })),
  
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id),
  })),
}));
