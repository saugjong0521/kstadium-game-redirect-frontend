// Mock data for lottery system testing
const USER_ADDRESS = '0x680288896065594F11a18D2B39a739dE81216bB4';

// Mock unrevealed tickets
const mockUnrevealedTickets = {
  tickets: [
    {
      id: 1,
      depositTx: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc1",
      payoutUsd: 5.50,
      revealed: false,
      revealedAt: null,
      createdAt: "2025-01-01T10:30:00.000Z"
    },
    {
      id: 2,
      depositTx: "0xdef456abc789123def456abc789123def456abc789123def456abc789123de2",
      payoutUsd: 12.75,
      revealed: false,
      revealedAt: null,
      createdAt: "2025-01-01T11:15:00.000Z"
    },
    {
      id: 3,
      depositTx: "0x789123abc456def789123abc456def789123abc456def789123abc456def78",
      payoutUsd: 3.25,
      revealed: false,
      revealedAt: null,
      createdAt: "2025-01-01T14:45:00.000Z"
    },
    {
      id: 4,
      depositTx: "0x456789def123abc456789def123abc456789def123abc456789def123abc45",
      payoutUsd: 8.00,
      revealed: false,
      revealedAt: null,
      createdAt: "2025-01-01T16:20:00.000Z"
    },
    {
      id: 5,
      depositTx: "0x123abc456def789123abc456def789123abc456def789123abc456def789123",
      payoutUsd: 15.50,
      revealed: false,
      revealedAt: null,
      createdAt: "2025-01-01T18:00:00.000Z"
    }
  ]
};

// Mock all tickets (including revealed)
const mockAllTickets = {
  tickets: [
    ...mockUnrevealedTickets.tickets,
    {
      id: 6,
      depositTx: "0xaaa111bbb222ccc333ddd444eee555fff666aaa111bbb222ccc333ddd444ee",
      payoutUsd: 7.25,
      revealed: true,
      revealedAt: "2024-12-30T12:30:00.000Z",
      createdAt: "2024-12-30T10:00:00.000Z"
    },
    {
      id: 7,
      depositTx: "0xbbb222ccc333ddd444eee555fff666aaa111bbb222ccc333ddd444eee555ff",
      payoutUsd: 10.00,
      revealed: true,
      revealedAt: "2024-12-30T14:15:00.000Z",
      createdAt: "2024-12-30T11:30:00.000Z"
    },
    {
      id: 8,
      depositTx: "0xccc333ddd444eee555fff666aaa111bbb222ccc333ddd444eee555fff666aa",
      payoutUsd: 4.50,
      revealed: true,
      revealedAt: "2024-12-31T09:00:00.000Z",
      createdAt: "2024-12-31T08:00:00.000Z"
    }
  ]
};

// Mock lottery summary
const mockLotterySummary = {
  totalTickets: 8,
  totalPayoutUsd: 66.75, // Sum of all payouts
  totalDepositsKsta: 800, // Assuming 100 KSTA per ticket
  unrevealedTickets: 5,
  address: USER_ADDRESS
};

// Mock lottery ranking
const mockLotteryRanking = {
  users: [
    {
      address: "0x1234567890123456789012345678901234567890",
      totalPayoutUsd: 150.50,
      totalCount: 12
    },
    {
      address: "0x2345678901234567890123456789012345678901",
      totalPayoutUsd: 125.75,
      totalCount: 10
    },
    {
      address: USER_ADDRESS,
      totalPayoutUsd: 66.75,
      totalCount: 8
    },
    {
      address: "0x3456789012345678901234567890123456789012",
      totalPayoutUsd: 45.25,
      totalCount: 6
    },
    {
      address: "0x4567890123456789012345678901234567890123",
      totalPayoutUsd: 32.00,
      totalCount: 5
    },
    {
      address: "0x5678901234567890123456789012345678901234",
      totalPayoutUsd: 28.50,
      totalCount: 4
    },
    {
      address: "0x6789012345678901234567890123456789012345",
      totalPayoutUsd: 22.00,
      totalCount: 3
    },
    {
      address: "0x7890123456789012345678901234567890123456",
      totalPayoutUsd: 18.75,
      totalCount: 3
    },
    {
      address: "0x8901234567890123456789012345678901234567",
      totalPayoutUsd: 15.25,
      totalCount: 2
    },
    {
      address: "0x9012345678901234567890123456789012345678",
      totalPayoutUsd: 12.50,
      totalCount: 2
    }
  ],
  totalCount: 50, // Total number of users in the system
  limit: 20
};

// Helper function to simulate ticket reveal
const mockRevealTicket = (ticketId) => {
  const ticket = mockUnrevealedTickets.tickets.find(t => t.id === ticketId);
  
  if (!ticket) {
    throw new Error('Ticket not found');
  }

  return {
    ...ticket,
    revealed: true,
    revealedAt: new Date().toISOString()
  };
};

// Export all named exports
export {
  mockUnrevealedTickets,
  mockAllTickets,
  mockLotterySummary,
  mockLotteryRanking,
  mockRevealTicket,
  USER_ADDRESS
};

// Default export
export default {
  mockUnrevealedTickets,
  mockAllTickets,
  mockLotterySummary,
  mockLotteryRanking,
  mockRevealTicket,
  USER_ADDRESS
};