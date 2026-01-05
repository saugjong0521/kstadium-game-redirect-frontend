import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store';
import { revealLotteryTicket, fetchLotterySummary } from '@/api/lotteryApi';
import LoadingSpinner from '@/components/LoadingSpinner';

function Lottery({ userAddress }) {
  const navigate = useNavigate();
  const { unrevealedTickets, lotteryTickets, updateTicketRevealed } = useUserStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [revealedTickets, setRevealedTickets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [countUpValue, setCountUpValue] = useState(0);

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
      
      setShowExplosion(true);
      
      const finalAmount = revealed.payoutUsd;
      const duration = 1000;
      const steps = 20;
      const increment = finalAmount / steps;
      
      for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
          setCountUpValue(Math.min(increment * i, finalAmount));
        }, (duration / steps) * i);
      }
      
      updateTicketRevealed(currentTicket.id, revealed);
      setRevealedTickets(prev => [...prev, revealed]);
      
      setTimeout(() => {
        setShowExplosion(false);
        setCountUpValue(0);
        setIsRevealing(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to reveal ticket:', err);
      setError('Failed to reveal ticket. Please try again.');
      setIsRevealing(false);
      setShowExplosion(false);
      setCountUpValue(0);
    }
  };

  const handleNextTicket = () => {
    if (currentIndex < unrevealedTickets.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const hasMoreTickets = currentIndex < unrevealedTickets.length - 1;
  const allRevealed = revealedTickets.length === unrevealedTickets.length;
  const hasAnyTickets = unrevealedTickets.length > 0 || lotteryTickets.length > 0 || revealedTickets.length > 0;

  // No tickets at all - never received any
  if (!hasAnyTickets) {
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Current Ticket Card */}
        {unrevealedTickets.length > 0 && currentTicket && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 relative overflow-hidden">
            {/* Explosion Effect */}
            {showExplosion && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse opacity-30 z-0"></div>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-4xl animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${0.8 + Math.random() * 0.4}s`
                    }}
                  >
                    {['🎉', '🎊', '✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 6)]}
                  </div>
                ))}
              </>
            )}
            
            <div className="text-center relative z-10">
              <div className={`text-8xl mb-6 transition-transform duration-500 ${
                showExplosion ? 'scale-150 rotate-12' : 'scale-100'
              }`}>
                🎟️
              </div>
              
              {revealedTickets.find(t => t.id === currentTicket.id) ? (
                // Step 3 & 4: Prize Revealed + Next Button
                <div className={`transition-all duration-700 ${
                  showExplosion ? 'scale-110' : 'scale-100'
                }`}>
                  <h2 className={`text-4xl font-bold mb-6 transition-all duration-500 ${
                    showExplosion ? 'text-yellow-500 scale-125' : 'text-green-600 scale-100'
                  }`}>
                    {showExplosion ? '💥 BOOM! 💥' : '🎉 Congratulations! 🎉'}
                  </h2>
                  
                  <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 border-4 rounded-2xl p-8 mb-6 transition-all duration-500 ${
                    showExplosion 
                      ? 'border-yellow-500 shadow-2xl scale-110' 
                      : 'border-yellow-400 shadow-lg scale-100'
                  }`}>
                    <p className="text-gray-600 text-lg mb-3 font-semibold">You won</p>
                    <p className={`font-black transition-all duration-300 ${
                      showExplosion 
                        ? 'text-7xl text-yellow-600 animate-bounce' 
                        : 'text-6xl text-orange-600'
                    }`}>
                      ${showExplosion ? countUpValue.toFixed(2) : (revealedTickets.find(t => t.id === currentTicket.id)?.payoutUsd || 0)}
                    </p>
                  </div>
                  
                  {!showExplosion && (
                    <>
                      <p className="text-gray-500 text-sm mb-4">
                        Ticket ID: #{currentTicket.id}
                      </p>
                      <p className="text-gray-400 text-xs mb-6">
                        Deposit Tx: {currentTicket.depositTx?.substring(0, 10)}...
                      </p>
                      
                      {/* Step 4: Next Ticket Button */}
                      {hasMoreTickets && (
                        <button
                          onClick={handleNextTicket}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                          Check Next Ticket →
                        </button>
                      )}
                      
                      {!hasMoreTickets && (
                        <p className="text-gray-600 text-lg">
                          All tickets revealed!
                        </p>
                      )}
                    </>
                  )}
                </div>
              ) : (
                // Step 1 & 2: Button to Reveal
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Reveal Your Prize!
                  </h2>
                  
                  {/* Prize Amount Display */}
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
                    <p className="text-gray-500 text-sm mb-2">Prize Amount</p>
                    <p className="text-5xl font-black text-orange-600">
                      ${currentTicket.payoutUsd || 0}
                    </p>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-2">
                    Ticket ID: #{currentTicket.id}
                  </p>
                  <p className="text-gray-400 text-xs mb-8">
                    Deposit Tx: {currentTicket.depositTx?.substring(0, 10)}...
                  </p>
                  
                  {/* Reveal Button */}
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

        {/* No Unrevealed Tickets - Step 1 Alternative */}
        {unrevealedTickets.length === 0 && revealedTickets.length === 0 && lotteryTickets.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 mb-8 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">All Tickets Revealed!</h3>
            <p className="text-gray-600">
              Send KSTA to get more lottery tickets.
            </p>
          </div>
        )}

        {/* Step 5: Revealed Tickets History */}
        {(revealedTickets.length > 0 || lotteryTickets.filter(t => t.revealed).length > 0) && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Revealed Tickets ({revealedTickets.length > 0 ? revealedTickets.length : lotteryTickets.filter(t => t.revealed).length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* Show tickets revealed in this session */}
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
              
              {/* Show previously revealed tickets from store if no tickets revealed in this session */}
              {revealedTickets.length === 0 && lotteryTickets.filter(t => t.revealed).map((ticket) => (
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
                        {ticket.revealedAt ? new Date(ticket.revealedAt).toLocaleString() : 'Previously revealed'}
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
                  Total Winnings {revealedTickets.length > 0 ? '(This Session)' : ''}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${revealedTickets.length > 0 
                    ? revealedTickets.reduce((sum, t) => sum + t.payoutUsd, 0) 
                    : lotteryTickets.filter(t => t.revealed).reduce((sum, t) => sum + t.payoutUsd, 0)
                  }
                </p>
              </div>
            </div>

            {(allRevealed || unrevealedTickets.length === 0) && (
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