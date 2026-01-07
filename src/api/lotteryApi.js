import { lotteryApi } from '@/api';
import { PATH } from '@/constants';
import {
  mockUnrevealedTickets,
  mockAllTickets,
  mockLotterySummary,
  mockLotteryRanking,
  mockRevealTicket
} from '@/assets/mockData/lotteryMockData';

// Mock mode flag - set to 'true' in .env to use mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_LOTTERY_MOCK === 'true';

// Simulate API delay
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 복권 내역 조회
export const fetchLotteryTickets = async (address, revealed = null) => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    
    if (revealed === false) {
      return mockUnrevealedTickets;
    } else if (revealed === true) {
      return {
        tickets: mockAllTickets.tickets.filter(t => t.revealed)
      };
    } else {
      return mockAllTickets;
    }
  }

  try {
    const params = { address };
    if (revealed !== null) {
      params.revealed = revealed;
    }
    
    const response = await lotteryApi.get(PATH.CHECKLOTTERYHISTORY, {
      params
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching lottery tickets:', error);
    throw error;
  }
};

// 단일 복권 공개
export const revealLotteryTicket = async (ticketId, address) => {
  if (USE_MOCK_DATA) {
    await mockDelay(800); // Longer delay to simulate processing
    return mockRevealTicket(ticketId);
  }

  try {
    const response = await lotteryApi.post(
      PATH.REVEALTICKET(ticketId),
      { address }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error revealing lottery ticket:', error);
    throw error;
  }
};

// 전체 복권 일괄 공개
export const revealAllLotteryTickets = async (address) => {
  if (USE_MOCK_DATA) {
    await mockDelay(1500);
    
    const revealedTickets = mockUnrevealedTickets.tickets.map(ticket => ({
      ...ticket,
      revealed: true,
      revealedAt: new Date().toISOString()
    }));
    
    return { tickets: revealedTickets };
  }

  try {
    const response = await lotteryApi.post(
      PATH.REVEALALLTICKETS,
      { address }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error revealing all lottery tickets:', error);
    throw error;
  }
};

// 복권 통계 조회 (주소별 요약)
export const fetchLotterySummary = async (address, revealedOnly = null) => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockLotterySummary;
  }

  try {
    const params = { address };
    if (revealedOnly !== null) {
      params.revealedOnly = revealedOnly;
    }
    
    const response = await lotteryApi.get(PATH.ADDRESSDATA, {
      params
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching lottery summary:', error);
    throw error;
  }
};

// 복권 당첨금 랭킹 조회
export const fetchLotteryRanking = async (limit = 100, revealedOnly = null) => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockLotteryRanking;
  }

  try {
    const params = { limit };
    if (revealedOnly !== null) {
      params.revealedOnly = revealedOnly;
    }
    
    const response = await lotteryApi.get(PATH.ROTTORANKING, {
      params
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching lottery ranking:', error);
    throw error;
  }
};