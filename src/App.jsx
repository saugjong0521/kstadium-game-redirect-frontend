import React from 'react';
import { useUserLogin, useRanking } from '@/hooks';
import { useUserStore } from '@/store';
import RankingTable from '@/components/RankingTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import MyRankingCard from '@/components/MyRankingCard';

function App() {
  const { isLoading: authLoading, isAuthenticated } = useUserLogin();
  const { top10, myRank, isLoading: rankingLoading, error } = useRanking();
  const { userAddress } = useUserStore();

  const handleEnterGame = () => {
    const redirectUrl = `${import.meta.env.VITE_PUBLIC_REDIRECT_BASE_URL}?id=${userAddress}`;
    window.location.href = redirectUrl;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Key Required</h1>
          <p className="text-gray-600">Please access this page through the app with a valid access key.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto">
        {/* Header with Enter Game Button */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            K STADIUM
          </h1>
          <p className="text-gray-600 mb-4">
            Wallet: <span className="font-mono text-sm">{userAddress}</span>
          </p>
          <button
            onClick={handleEnterGame}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🎮 Enter Game
          </button>
        </div>

        {/* Rankings Section */}
        {rankingLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
              <p className="font-semibold">Rankings temporarily unavailable</p>
              <p className="text-sm mt-1">Unable to load rankings, but you can still enter the game.</p>
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
    </div>
  );
}

export default App;