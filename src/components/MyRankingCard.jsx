const MyRankingCard = ({ myRank }) => {
  if (!myRank) return null;

  const formatBalance = (balance) => {
    const num = parseFloat(balance);
    if (Number.isNaN(num)) return '-';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="max-w-4xl mx-auto mb-6 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">My Ranking</h3>
        </div>
        <div className="flex items-center">
          <span className="text-3xl mr-2">{getRankIcon(myRank.rank)}</span>
        </div>
      </div>

      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Wallet Address
          </p>
          <p className="font-mono text-sm text-gray-900 mt-1">
            {formatAddress(myRank.id)}
          </p>
        </div>

        {myRank.balance !== undefined && (
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Balance
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formatBalance(myRank.balance)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRankingCard;