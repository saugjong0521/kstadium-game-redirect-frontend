import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store';
import { revealLotteryTicket, fetchLotterySummary } from '@/api/lotteryApi';
import LoadingSpinner from '@/components/LoadingSpinner';

function Lottery({ userAddress }) {
  const navigate = useNavigate();
  const { unrevealedTickets, updateTicketRevealed } = useUserStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedTickets, setRevealedTickets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const currentTicket = unrevealedTickets[currentIndex];

  // Fetch summary data
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await fetchLotterySummary(userAddress);
        setSummary(data);
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    };

    if (userAddress) {
      fetchSummary();
    }
  }, [userAddress]);

  const handleRevealTicket = async () => {
    if (!currentTicket || isRevealing) return;

    setIsRevealing(true);
    setError(null);

    try {
      const revealed = await revealLotteryTicket(currentTicket.id, userAddress);
      
      // Store에 업데이트
      updateTicketRevealed(currentTicket.id, revealed);
      
      // 로컬 공개 목록에 추가
      setRevealedTickets(prev => [...prev, revealed]);
      
      // 다음 티켓으로 자동 이동 (1.5초 후)
      setTimeout(() => {
        if (currentIndex < unrevealedTickets.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
        setIsRevealing(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to reveal ticket:', err);
      setError('Failed to reveal ticket. Please try again.');
      setIsRevealing(false);
    }
  };

  const hasMoreTickets = currentIndex < unrevealedTickets.length - 1;
  const allRevealed = revealedTickets.length === unrevealedTickets.length;

  // No tickets available
  if (unrevealedTickets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-gray-600 hover:text-gray-800 inline-flex items-center gap-2 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>

          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-6">🎫</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Tickets Available</h2>
            <p className="text-gray-600 mb-8">
              You don't have any unrevealed lottery tickets at the moment.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-800 inline-flex items-center gap-2 transition-colors"
        >
          <span>←</span>
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎫 Lottery Tickets
          </h1>
          <p className="text-gray-600">
            Ticket {currentIndex + 1} of {unrevealedTickets.length}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Wallet: <span className="font-mono">{userAddress}</span>
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Total Tickets</p>
              <p className="text-2xl font-bold text-blue-600">{summary.totalTickets || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Unrevealed</p>
              <p className="text-2xl font-bold text-orange-600">{summary.unrevealedTickets || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Total Winnings</p>
              <p className="text-2xl font-bold text-green-600">${summary.totalUsd || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Total KSTA</p>
              <p className="text-2xl font-bold text-purple-600">{summary.totalKsta || 0}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Current Ticket Card */}
        {!allRevealed && currentTicket && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="text-center">
              <div className="text-8xl mb-6">🎟️</div>
              
              {revealedTickets.find(t => t.id === currentTicket.id) ? (
                // Revealed State
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold text-green-600 mb-4">
                    🎉 Congratulations!
                  </h2>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 mb-6">
                    <p className="text-gray-600 text-sm mb-2">You won</p>
                    <p className="text-5xl font-bold text-orange-600">
                      ${revealedTickets.find(t => t.id === currentTicket.id)?.payoutUsd || 0}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Ticket ID: #{currentTicket.id}
                  </p>
                  <p className="text-gray-400 text-xs mb-6">
                    Deposit Tx: {currentTicket.depositTx?.substring(0, 10)}...
                  </p>
                  {hasMoreTickets && (
                    <button
                      onClick={() => setCurrentIndex(prev => prev + 1)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                      Next Ticket →
                    </button>
                  )}
                </div>
              ) : (
                // Unrevealed State
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Scratch to Reveal
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Click the button below to reveal your prize
                  </p>
                  <p className="text-gray-500 text-sm mb-2">
                    Ticket ID: #{currentTicket.id}
                  </p>
                  <p className="text-gray-400 text-xs mb-6">
                    Deposit Tx: {currentTicket.depositTx?.substring(0, 10)}...
                  </p>
                  <button
                    onClick={handleRevealTicket}
                    disabled={isRevealing}
                    className="bg-gradient-to-r from-orange-600 to-pink-600 text-white px-12 py-4 rounded-xl text-xl font-semibold hover:from-orange-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
                  >
                    {isRevealing ? (
                      <>
                        <LoadingSpinner />
                        <span>Revealing...</span>
                      </>
                    ) : (
                      <>
                        <span>🎰</span>
                        <span>Reveal Prize</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Revealed Tickets Summary */}
        {revealedTickets.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Revealed Tickets ({revealedTickets.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {revealedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎫</span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Ticket #{ticket.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(ticket.revealedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">
                      ${ticket.payoutUsd}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total Winnings */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-800">
                  Total Winnings
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${revealedTickets.reduce((sum, t) => sum + t.payoutUsd, 0)}
                </p>
              </div>
            </div>

            {allRevealed && (
              <button
                onClick={() => navigate('/')}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Back to Home
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Lottery;