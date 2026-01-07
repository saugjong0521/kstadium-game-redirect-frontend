import { useEffect, useState } from "react";
import { webGameApi } from "@/api";
import { PATH } from "@/constants";
import { useUserStore } from "@/store";
import { lotteryApi } from "../api";

// Mock data for testing when API is down
const MOCK_DATA = [
  { id: "0x1234...5678", balance: 10000000000, rank: 1 },
  { id: "0xabcd...ef12", balance: 9987550000, rank: 2 },
  { id: "0x9876...5432", balance: 8500000000, rank: 3 },
  { id: "0xfedc...ba98", balance: 7200000000, rank: 4 },
  { id: "0x1111...2222", balance: 5000000000, rank: 5 },
  { id: "0x3333...4444", balance: 3500000000, rank: 6 },
  { id: "0x5555...6666", balance: 2000000000, rank: 7 },
  { id: "0x7777...8888", balance: 1500000000, rank: 8 },
  { id: "0x9999...aaaa", balance: 1000000000, rank: 9 },
  { id: "0xbbbb...cccc", balance: 500000000, rank: 10 },
];

const useRanking = (useMockData = false) => {
  const [top10, setTop10] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userAddress } = useUserStore();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setIsLoading(true);

        const users = useMockData
          ? MOCK_DATA
          : (await lotteryApi.get(PATH.NEWRANKING)).data?.users ?? [];

        // 1️⃣ 잔고 기준 정렬
        const sorted = [...users].sort((a, b) => b.balance - a.balance);

        // 2️⃣ Top 10
        const top10List = sorted.slice(0, 10).map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        setTop10(top10List);

        // 3️⃣ 내 랭킹 찾기 (대소문자 무시 비교)
        const myIndex = sorted.findIndex(
          (user) => user.id && userAddress && 
            user.id.toLowerCase() === userAddress.toLowerCase()
        );

        if (myIndex !== -1) {
          setMyRank({
            ...sorted[myIndex],
            rank: myIndex + 1,
          });
        } else {
          setMyRank(null);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [userAddress, useMockData]);

  return {
    top10,
    myRank,
    isLoading,
    error,
  };
};


export { useRanking };