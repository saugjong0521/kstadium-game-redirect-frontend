import { useEffect, useState } from 'react';
import { useUserStore } from '@/store';
import { fetchLotteryTickets } from '@/api/lotteryApi';

export const useLotteryCheck = () => {
  const { userAddress, setUnrevealedTickets, setLotteryTickets } = useUserStore();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLotteryTickets = async () => {
      if (!userAddress) return;

      setIsChecking(true);
      setError(null);

      try {
        // 미공개 복권 확인
        const unrevealedResponse = await fetchLotteryTickets(userAddress, false);
        
        if (unrevealedResponse?.tickets) {
          setUnrevealedTickets(unrevealedResponse.tickets);
        }

        // 전체 복권도 가져오기 (선택적)
        const allTicketsResponse = await fetchLotteryTickets(userAddress);
        if (allTicketsResponse?.tickets) {
          setLotteryTickets(allTicketsResponse.tickets);
        }
      } catch (err) {
        console.error('Error checking lottery tickets:', err);
        setError(err);
      } finally {
        setIsChecking(false);
      }
    };

    checkLotteryTickets();
  }, [userAddress, setUnrevealedTickets, setLotteryTickets]);

  return { isChecking, error };
};