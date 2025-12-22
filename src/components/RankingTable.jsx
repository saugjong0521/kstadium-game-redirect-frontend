import React from 'react';

const RankingTable = ({ rankings, userAddress }) => {
  const formatBalance = (balance) => {
    const num = parseFloat(balance);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center">🏆 Top 10 Rankings</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankings.map((user) => (
              <tr 
                key={user.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  user.id === userAddress ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.rank === 1 && <span className="text-2xl mr-2">🥇</span>}
                    {user.rank === 2 && <span className="text-2xl mr-2">🥈</span>}
                    {user.rank === 3 && <span className="text-2xl mr-2">🥉</span>}
                    {user.rank > 3 && (
                      <span className="text-lg font-semibold text-gray-700 mr-2">
                        #{user.rank}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatAddress(user.id)}
                    {user.id === userAddress && (
                      <span className="ml-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatBalance(user.balance)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
