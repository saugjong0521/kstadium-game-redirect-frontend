import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store';

function Main({ userAddress }) {
  const navigate = useNavigate();
  const { unrevealedCount } = useUserStore();
  const [copied, setCopied] = useState(false);

  const DEPOSIT_ADDRESS = '0xc13b4833d0126ed7e788e04e41b6657adfd6f97d';

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(DEPOSIT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEnterGame = () => {
    const redirectUrl = `${import.meta.env.VITE_PUBLIC_REDIRECT_BASE_URL}?id=${userAddress}`;
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            K STADIUM x GAME
          </h1>
          <p className="text-gray-500 text-sm">
            Your Wallet: <span className="font-mono">{userAddress}</span>
          </p>
        </div>

        {/* KSTA Deposit Address */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💰</span>
              <h3 className="text-lg font-bold text-gray-800">KSTA Deposit Address</h3>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
              <code className="flex-1 text-sm font-mono text-gray-700 break-all">
                {DEPOSIT_ADDRESS}
              </code>
              <button
                onClick={handleCopyAddress}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Deposit KSTA to this address to receive lottery tickets
            </p>
          </div>
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
                  : 'Check your lottery tickets and history'
                }
              </p>
              <button
                onClick={() => navigate('/lottery')}
                className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                {unrevealedCount > 0 ? 'Reveal My Tickets' : 'View Lottery'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;