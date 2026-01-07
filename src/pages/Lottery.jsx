import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store';
import { revealLotteryTicket, fetchLotterySummary, fetchLotteryTickets } from '@/api/lotteryApi';
import LoadingSpinner from '@/components/LoadingSpinner';

function Lottery({ userAddress }) {
  const navigate = useNavigate();
  const { unrevealedTickets, lotteryTickets, updateTicketRevealed, setLotteryTickets } = useUserStore();
  
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealedTickets, setRevealedTickets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [revealedPrize, setRevealedPrize] = useState(null); // 현재 티켓의 당첨금
  const [isCountingUp, setIsCountingUp] = useState(false); // 숫자 카운트업 애니메이션
  const [displayAmount, setDisplayAmount] = useState(0); // 표시되는 금액

  // 현재 티켓 찾기: 먼저 reveal된 티켓에서 찾고, 없으면 unrevealed에서 찾기
  const currentTicket = revealedTickets.find(t => t.id === currentTicketId) || 
                        unrevealedTickets.find(t => t.id === currentTicketId) ||
                        unrevealedTickets[0] ||
                        null;
  
  // currentTicketId가 없으면 첫 번째 티켓으로 설정
  useEffect(() => {
    if (!currentTicketId && unrevealedTickets.length > 0) {
      setCurrentTicketId(unrevealedTickets[0].id);
    }
  }, [unrevealedTickets, currentTicketId]);

  // id 기준으로 티켓 병합
  const dedupeById = (arr) => {
    const map = new Map();
    arr.forEach((item) => {
      if (!item) return;
      const existing = map.get(item.id);
      // 이미 존재하면 revealed 상태를 우선시해 병합
      if (!existing || item.revealed) {
        map.set(item.id, { ...existing, ...item });
      }
    });
    return Array.from(map.values());
  };

  const isCurrentTicketRevealed = revealedTickets.some(t => t.id === currentTicketId) || revealedPrize !== null;
  const currentIdx = unrevealedTickets.findIndex(t => t.id === currentTicketId);

  // 페이지 진입 시 revealed 티켓들 로드 (API + store 병합)
  useEffect(() => {
    const loadRevealedTickets = async () => {
      if (!userAddress) return;

      try {
        // Revealed된 티켓들 가져오기
        const revealedResponse = await fetchLotteryTickets(userAddress, true);
        const apiRevealed = revealedResponse?.tickets ?? [];
        const storeRevealed = lotteryTickets.filter(t => t.revealed);

        // 전체 티켓도 업데이트 (revealed 상태 동기화)
        const allTicketsResponse = await fetchLotteryTickets(userAddress);
        const apiAll = allTicketsResponse?.tickets ?? [];

        // 모든 티켓 병합 (revealed 우선)
        const mergedAll = dedupeById([
          ...apiAll,
          ...storeRevealed,
          ...revealedTickets, // 직전 세션(컴포넌트 state)에 있던 것 유지
        ]);
        setLotteryTickets(mergedAll);

        // revealed 전용 리스트 병합
        const mergedRevealed = dedupeById([
          ...apiRevealed,
          ...storeRevealed,
          ...revealedTickets,
        ]).filter(t => t.revealed);
        if (mergedRevealed.length > 0) {
          setRevealedTickets(mergedRevealed);
        }
      } catch (err) {
        console.error('Error loading revealed tickets:', err);
        // 에러 시 store의 revealed 티켓들 사용
        const storeRevealed = lotteryTickets.filter(t => t.revealed);
        if (storeRevealed.length > 0) {
          setRevealedTickets(storeRevealed);
        }
      }
    };

    loadRevealedTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]); // userAddress 변경 시에만 실행

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
    setRevealedPrize(null);
    setDisplayAmount(0);

    try {
      const revealed = await revealLotteryTicket(currentTicket.id, userAddress);
      
      // Store에서 업데이트
      updateTicketRevealed(currentTicket.id, revealed);
      
      // 상태 업데이트 - revealedTickets에 추가하고 revealedPrize 설정
      setRevealedTickets(prev => [...prev, revealed]);
      setRevealedPrize(revealed.payoutUsd);
      
      // 짧은 딜레이 후 confetti와 카운트업 시작
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setShowConfetti(true);
      setIsCountingUp(true);
      
      // 숫자 카운트업 애니메이션
      const targetAmount = revealed.payoutUsd;
      const duration = 1500; // 1.5초 동안 카운트업
      const steps = 60;
      const increment = targetAmount / steps;
      const stepDuration = duration / steps;
      
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetAmount) {
          setDisplayAmount(targetAmount);
          clearInterval(timer);
          setIsCountingUp(false);
          
          // Confetti는 더 짧게 표시
          setTimeout(() => {
            setShowConfetti(false);
            setIsRevealing(false);
          }, 800);
        } else {
          setDisplayAmount(current);
        }
      }, stepDuration);
      
    } catch (err) {
      console.error('Failed to reveal ticket:', err);
      setError('Failed to reveal ticket. Please try again.');
      setIsRevealing(false);
      setRevealedPrize(null);
    }
  };

  const handleNextTicket = () => {
    // 현재 티켓의 인덱스를 찾고, 다음 unrevealed 티켓으로 이동
    const idx = unrevealedTickets.findIndex(t => t.id === currentTicketId);
    if (idx < unrevealedTickets.length - 1) {
      const nextTicket = unrevealedTickets[idx + 1];
      if (nextTicket) {
        setCurrentTicketId(nextTicket.id);
        setRevealedPrize(null); // 다음 티켓으로 이동 시 초기화
        setDisplayAmount(0);
      }
    }
  };

  // 현재 티켓의 인덱스를 기준으로 다음 티켓이 있는지 확인
  const hasMoreTickets = currentIdx < unrevealedTickets.length - 1;
  const allRevealed = unrevealedTickets.length === 0;
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

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-12 text-center">
            <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎫</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">No Tickets Available</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              You don't have any unrevealed lottery tickets at the moment.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-6 sm:py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 sm:mb-6 text-gray-600 hover:text-gray-800 inline-flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
          <span>←</span>
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            🎫 Lottery Tickets
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {currentTicket && (
              <>
                Ticket {currentIdx >= 0 ? currentIdx + 1 : revealedTickets.length} of {unrevealedTickets.length + revealedTickets.length}
                {isCurrentTicketRevealed && <span className="ml-2 text-green-600">✓ Revealed</span>}
              </>
            )}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 break-all sm:break-normal">
            Wallet: <span className="font-mono">{userAddress}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg">
            <p className="text-sm sm:text-base font-semibold">{error}</p>
          </div>
        )}

        {/* Current Ticket Card */}
        {currentTicket && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden">
            {/* Subtle Confetti Effect */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-2xl sm:text-3xl opacity-80"
                    style={{
                      left: `${15 + i * 15}%`,
                      top: `${20 + (i % 3) * 25}%`,
                      animation: `gentle-float 2s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  >
                    {['🎉', '✨', '⭐'][i % 3]}
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center relative z-0">
              {/* Ticket icon with subtle animation */}
              <div className={`text-6xl sm:text-8xl mb-4 sm:mb-6 transition-all duration-500 ${
                showConfetti ? 'scale-110' : 
                isRevealing ? 'opacity-80' : 
                'scale-100'
              }`}>
                🎟️
              </div>
              
              {isCurrentTicketRevealed ? (
                // Step 3 & 4: Prize Revealed + Next Button
                <div className="animate-fade-in">
                  <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-green-600">
                    🎉 Congratulations! 🎉
                  </h2>
                  
                  {/* Prize box with count-up effect */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-400 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-6">
                    <p className="text-gray-600 text-sm sm:text-lg mb-2 sm:mb-3 font-semibold">You won</p>
                    <p className="text-4xl sm:text-6xl font-black text-orange-600">
                      ${displayAmount.toFixed(2)}
                    </p>
                    {isCountingUp && (
                      <p className="text-xs sm:text-sm text-orange-500 mt-2">
                        Counting up...
                      </p>
                    )}
                  </div>
                  
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-4">
                    Ticket ID: #{currentTicket.id}
                  </p>
                  <p className="text-gray-400 text-xs mb-4 sm:mb-6 break-all sm:break-normal">
                    Deposit Tx: {currentTicket.depositTx?.substring(0, 10)}...
                  </p>
                  
                  {/* Step 4: Next Ticket Button */}
                  {!isCountingUp && hasMoreTickets && (
                    <button
                      onClick={handleNextTicket}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg animate-fade-in"
                    >
                      Check Next Ticket →
                    </button>
                  )}
                  
                  {!showConfetti && !isCountingUp && !hasMoreTickets && (
                    <p className="text-gray-600 text-base sm:text-lg">
                      All tickets revealed!
                    </p>
                  )}
                </div>
              ) : (
                // Step 1 & 2: Button to Reveal
                <div>
                  <h2 className={`text-xl sm:text-3xl font-bold mb-4 sm:mb-6 transition-colors ${
                    isRevealing ? 'text-orange-600' : 'text-gray-800'
                  }`}>
                    {isRevealing ? 'Revealing Your Prize...' : 'Reveal Your Prize!'}
                  </h2>
                  
                  {/* Hidden Prize - Question Marks */}
                  <div className={`bg-gradient-to-r from-gray-50 to-gray-100 border-2 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 transition-all ${
                    isRevealing 
                      ? 'border-orange-400 shadow-md' 
                      : 'border-gray-300'
                  }`}>
                    <p className="text-gray-500 text-xs sm:text-sm mb-2">Prize Amount</p>
                    <p className={`text-3xl sm:text-5xl font-black transition-colors ${
                      isRevealing ? 'text-orange-500' : 'text-gray-400'
                    }`}>
                      ???
                    </p>
                  </div>
                  
                  <p className="text-gray-500 text-xs sm:text-sm mb-2">
                    Ticket ID: #{currentTicket.id}
                  </p>
                  <p className="text-gray-400 text-xs mb-4 sm:mb-8 break-all sm:break-normal">
                    Deposit Tx: {currentTicket.depositTx?.substring(0, 10)}...
                  </p>
                  
                  {/* Reveal Button */}
                  <button
                    onClick={handleRevealTicket}
                    disabled={isRevealing}
                    className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-pink-600 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-semibold hover:from-orange-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 text-center">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">✨</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">All Tickets Revealed!</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Send KSTA to get more lottery tickets.
            </p>
          </div>
        )}

        {/* Step 5: Revealed Tickets History */}
        {(revealedTickets.length > 0 || lotteryTickets.filter(t => t.revealed).length > 0) && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
              Revealed Tickets ({revealedTickets.length > 0 ? revealedTickets.length : lotteryTickets.filter(t => t.revealed).length})
            </h3>
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
              {/* Show tickets revealed in this session */}
              {revealedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="text-xl sm:text-2xl flex-shrink-0">🎫</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                        Ticket #{ticket.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(ticket.revealedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-lg sm:text-2xl font-bold text-orange-600">
                      ${ticket.payoutUsd}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Show previously revealed tickets from store if no tickets revealed in this session */}
              {revealedTickets.length === 0 && lotteryTickets.filter(t => t.revealed).map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="text-xl sm:text-2xl flex-shrink-0">🎫</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                        Ticket #{ticket.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticket.revealedAt ? new Date(ticket.revealedAt).toLocaleString() : 'Previously revealed'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-lg sm:text-2xl font-bold text-orange-600">
                      ${ticket.payoutUsd}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total Winnings */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm sm:text-lg font-semibold text-gray-800">
                  Total Winnings {revealedTickets.length > 0 ? '(This Session)' : ''}
                </p>
                <p className="text-xl sm:text-3xl font-bold text-green-600 flex-shrink-0">
                  ${revealedTickets.length > 0 
                    ? revealedTickets.reduce((sum, t) => sum + t.payoutUsd, 0).toFixed(2)
                    : lotteryTickets.filter(t => t.revealed).reduce((sum, t) => sum + t.payoutUsd, 0).toFixed(2)
                  }
                </p>
              </div>
            </div>

            {(allRevealed || unrevealedTickets.length === 0) && (
              <button
                onClick={() => navigate('/')}
                className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
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