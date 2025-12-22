import { create } from 'zustand';

const useUserStore = create((set) => ({
  userInfo: null,
  userAddress: '',
  setUserInfo: (info) => set({ userInfo: info }),
  setUserAddress: (address) => set({ userAddress: address }),
}));

export { useUserStore };
