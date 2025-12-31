import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUserLogin } from '@/hooks';
import { useLotteryCheck } from '@/hooks/useLotteryCheck';
import { useUserStore } from '@/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import Main from '@/pages/Main';
import Ranking from '@/pages/Ranking';
import Lottery from '@/pages/Lottery';

function App() {
  const { isLoading: authLoading, isAuthenticated } = useUserLogin();
  const { userAddress } = useUserStore();
  
  // 로그인 후 복권 체크
  useLotteryCheck();

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
    <Router>
      <Routes>
        <Route path="/" element={<Main userAddress={userAddress} />} />
        <Route path="/ranking" element={<Ranking userAddress={userAddress} />} />
        <Route path="/lottery" element={<Lottery userAddress={userAddress} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;