import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store';

function Main({ userAddress }) {
  const navigate = useNavigate();
  const { unrevealedCount } = useUserStore();

  const handleEnterGame = () => {
    const redirectUrl = `${import.meta.env.VITE_PUBLIC_REDIRECT_BASE_URL}?id=${userAddress}`;
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            K STADIUM
          </h1>
          <p className="text-gray-600 mb-2">
            Welcome to K Stadium
          </p>
          <p className="text-gray-500 text-sm">
            Wallet: <span className="font-mono">{userAddress}</span>
          </p>
        </div>

        {/* Main Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Enter Game Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Enter Game</h2>
              <p className="text-gray-600 mb-6">
                Start playing and compete with others
              </p>
              <button
                onClick={handleEnterGame}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Play Now
              </button>
            </div>
          </div>

          {/* Game Ranking Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Rankings</h2>
              <p className="text-gray-600 mb-6">
                Check the leaderboard and top players
              </p>
              <button
                onClick={() => navigate('/ranking')}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
              >
                View Rankings
              </button>
            </div>
          </div>

          {/* Lottery Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow md:col-span-2">
            <div className="text-center">
              <div className="text-6xl mb-4">🎫</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Lottery Tickets
                {unrevealedCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-3 py-1 text-sm font-bold text-white bg-red-500 rounded-full">
                    {unrevealedCount}
                  </span>
                )}
              </h2>
              <p className="text-gray-600 mb-6">
                {unrevealedCount > 0 
                  ? `You have ${unrevealedCount} unrevealed ticket${unrevealedCount > 1 ? 's' : ''}`
                  : 'Check and reveal your lottery tickets'
                }
              </p>
              <button
                onClick={() => navigate('/lottery')}
                disabled={unrevealedCount === 0}
                className={`w-full ${
                  unrevealedCount > 0
                    ? 'bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 transform hover:scale-105'
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg`}
              >
                {unrevealedCount > 0 ? 'Reveal My Tickets' : 'No Tickets Available'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;