import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      userInfo: null,
      userAddress: '',
      lotteryTickets: [], // 전체 복권 목록
      unrevealedTickets: [], // 미공개 복권 목록
      unrevealedCount: 0, // 미공개 복권 개수
      
      setUserInfo: (info) => set({ userInfo: info }),
      setUserAddress: (address) => set({ userAddress: address }),
      
      setLotteryTickets: (tickets) => set({ lotteryTickets: tickets }),
      
      setUnrevealedTickets: (tickets) => {
        const unrevealed = tickets.filter(t => !t.revealed);
        set({ 
          unrevealedTickets: unrevealed,
          unrevealedCount: unrevealed.length 
        });
      },
      
      // 복권 공개 후 상태 업데이트
      updateTicketRevealed: (ticketId, revealedData) => set((state) => ({
        lotteryTickets: state.lotteryTickets.map(t => 
          t.id === ticketId ? { ...t, ...revealedData } : t
        ),
        unrevealedTickets: state.unrevealedTickets.filter(t => t.id !== ticketId),
        unrevealedCount: state.unrevealedCount - 1
      })),
      
      // 복권 데이터 초기화
      clearLotteryData: () => set({
        lotteryTickets: [],
        unrevealedTickets: [],
        unrevealedCount: 0
      })
    }),
    {
      name: 'userStore',
      storage: createJSONStorage(() => sessionStorage),
      // userInfo와 userAddress만 persist, 복권 데이터는 제외 (매번 새로 로드)
      partialize: (state) => ({
        userInfo: state.userInfo,
        userAddress: state.userAddress
      })
    }
  )
);

export { useUserStore };