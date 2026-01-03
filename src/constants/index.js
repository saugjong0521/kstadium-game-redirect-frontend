const PATH = {
  KSTARLOGIN: "/kstadium/api/comm/external/dex/login",
  RANKING: "/webgame/ranking",

  // 입금내역 확인용도, 굳이..? q address
  CHECKRECENTDEPOSIT: "/deposits",

  // 로그인 시에 얘를 통해서 복권 있는지 확인, q address랑 revealed false넣고 있으면 
  CHECKLOTTERYHISTORY: "/lottery/tickets",

  // 위에서 false인애 순차적으로 넣고 여기서 하나씩 공개
  REVEALTICKET: (id) => `/lottery/tickets/${id}/reveal`,

  //일괄공개
  REVEALALLTICKETS: "/lottery/tickets/reveal",



  //통계용

  // Q address revealedOnly 전체 티켓, 전체 usd, 전체 입금 ksta, 안깐 복권 갯수
  ADDRESSDATA: "/lottery/summary",

  // Q revealedOnly 당첨금 랭킹 
  ROTTORANKING: "/lottery/payouts/ranking",

  NEWRANKING: "/points/ranking"

};

export { PATH };
