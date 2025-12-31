import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRanking } from '@/hooks';
import { fetchLotteryRanking, fetchLotterySummary } from '@/api/lotteryApi';
import RankingTable from '@/components/RankingTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import MyRankingCard from '@/components/MyRankingCard';

function Ranking({ userAddress }) {
  const navigate = useNavigate();
  
  // Game ranking data
  const { top10, myRank, isLoading: rankingLoading, error } = useRanking();
  
  // Lottery ranking data
  const [activeTab, setActiveTab] = useState('game'); // 'game' or 'lottery'
  const [lotteryRankings, setLotteryRankings] = useState([]);
  const [lotteryTotalCount, setLotteryTotalCount] = useState(0);
  const [lotteryLimit, setLotteryLimit] = useState(20);
  const [isLoadingLottery, setIsLoadingLottery] = useState(false);
  const [lotteryError, setLotteryError] = useState(null);
  const [lotterySummary, setLotterySummary] = useState(null);

  // Load lottery rankings and summary
  useEffect(() => {
    if (activeTab === 'lottery') {
      loadLotteryData();
    }
  }, [activeTab, lotteryLimit]);

  const loadLotteryData = async () => {
    try {
      setIsLoadingLottery(true);
      setLotteryError(null);
      
      // Fetch both rankings and summary
      const [rankingData, summaryData] = await Promise.all([
        fetchLotteryRanking(lotteryLimit, true),
        fetchLotterySummary(userAddress)
      ]);
      
      setLotteryRankings(rankingData.users || []);
      setLotteryTotalCount(rankingData.totalCount || 0);
      setLotterySummary(summaryData);
    } catch (err) {
      console.error('Error loading lottery data:', err);
      setLotteryError('Failed to load lottery data');
    } finally {
      setIsLoadingLottery(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const isCurrentUser = (address) => {
    return address?.toLowerCase() === userAddress?.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header with Back Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-800 inline-flex items-center gap-2 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏆 Rankings
          </h1>
          <p className="text-gray-600 mb-6">
            Wallet: <span className="font-mono text-sm">{userAddress}</span>
          </p>

          {/* Tab Navigation */}
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'game'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎮 Game Rankings
            </button>
            <button
              onClick={() => setActiveTab('lottery')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'lottery'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎫 Lottery Payouts
            </button>
          </div>
        </div>

        {/* Game Rankings Tab */}
        {activeTab === 'game' && (
          <div>
            {rankingLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
                  <p className="font-semibold">Rankings temporarily unavailable</p>
                  <p className="text-sm mt-1">Unable to load rankings. Please try again later.</p>
                </div>
              </div>
            ) : top10.length > 0 ? (
              <>
                <MyRankingCard myRank={myRank} />
                <RankingTable rankings={top10} userAddress={userAddress} />
              </>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-4 rounded-lg text-center">
                  <p>No ranking data available</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lottery Payouts Tab */}
        {activeTab === 'lottery' && (
          <div>
            {/* Lottery Summary Statistics */}
            {lotterySummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Tickets</p>
                  <p className="text-2xl font-bold text-blue-600">{lotterySummary.totalTickets || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">Unrevealed</p>
                  <p className="text-2xl font-bold text-orange-600">{lotterySummary.unrevealedTickets || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Winnings</p>
                  <p className="text-2xl font-bold text-green-600">${lotterySummary.totalPayoutUsd || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Deposits</p>
                  <p className="text-2xl font-bold text-purple-600">{lotterySummary.totalDepositsKsta || 0}</p>
                  <p className="text-gray-400 text-xs">KSTA</p>
                </div>
              </div>
            )}

            {/* Limit Selector */}
            <div className="flex justify-center gap-2 mb-6">
              {[20, 50, 100].map((count) => (
                <button
                  key={count}
                  onClick={() => setLotteryLimit(count)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    lotteryLimit === count
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  Top {count}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {lotteryError && (
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                  <p className="font-semibold">{lotteryError}</p>
                </div>
              </div>
            )}

            {/* Loading */}
            {isLoadingLottery ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Address</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Total Payout (USD)</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Tickets</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {lotteryRankings.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                            No lottery rankings available
                          </td>
                        </tr>
                      ) : (
                        lotteryRankings.map((user, index) => {
                          const rank = index + 1;
                          const isUser = isCurrentUser(user.address);
                          
                          return (
                            <tr
                              key={user.address}
                              className={`hover:bg-gray-50 transition-colors ${
                                isUser ? 'bg-blue-50' : ''
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {rank === 1 && <span className="text-2xl">🥇</span>}
                                  {rank === 2 && <span className="text-2xl">🥈</span>}
                                  {rank === 3 && <span className="text-2xl">🥉</span>}
                                  <span className={`font-semibold ${
                                    rank <= 3 ? 'text-orange-600' : 'text-gray-600'
                                  }`}>
                                    #{rank}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm">
                                    {formatAddress(user.address)}
                                  </span>
                                  {isUser && (
                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                      You
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-lg font-bold text-green-600">
                                  ${user.totalPayoutUsd?.toFixed(2) || '0.00'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-gray-600">
                                  {user.totalCount || 0}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-600">
                  Showing {lotteryRankings.length} of {lotteryTotalCount} total winners
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ranking;