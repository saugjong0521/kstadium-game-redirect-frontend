import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAccessTokenStore = create(
  persist(
    (set) => ({
      getAccessToken: '',
      setAccessToken: (value) => {
        set(() => ({ getAccessToken: value }));
      },
    }),
    { name: 'accessToken', storage: createJSONStorage(() => sessionStorage) }
  )
);

export { useAccessTokenStore };
