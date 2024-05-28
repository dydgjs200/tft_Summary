const axios = require("axios");
const userService = require("./userService");

exports.getAllUsers = (req, res) => {
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]);
};

// db에 유저가 있을 시 정보 리턴
exports.findUser = async (req, res, next) => {
  const gameName = encodeURIComponent(req.params.gameName);
  const region = req.body.region;
  const tagLine = req.body.tagLine;

  const User = await userService.findgameName(gameName);

  if (User) {
    res.send(User);
  } else {
    req.gameName = gameName;
    req.region = region;
    req.tagLine = tagLine;

    next(); //next to getUserInfo
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    const gameName = encodeURIComponent(req.params.gameName);
    const region = req.body.region;
    const tagLine = req.body.tagLine;

    // gameName + tagLine을 이용한 puuid
    const accountUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${process.env.API_KEY}`;
    const getPuuid = await axios.get(accountUrl);
    const puuid = getPuuid.data.puuid;

    // puuid를 이용한 summonerId
    const summonerUrl = `https://kr.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${process.env.API_KEY}`;
    const getSummonerId = await axios.get(summonerUrl);
    const summonerId = getSummonerId.data.id; // summonerId = id

    // summonerId를 이용한 rank 찾기
    const rankUrl = `https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}?api_key=${process.env.API_KEY}`;
    const getRank = await axios.get(rankUrl);
    const rankInfo = getRank.data;

    req.summonerId = summonerId;
    req.gameName = gameName;
    req.tagLine = tagLine;
    req.rankInfo = rankInfo[0];
    req.puuid = puuid;
    req.region = region;

    next(); //next to getUserMatchHistory
  } catch (err) {
    console.log("error > ", err);
    res.status(500).json({ message: "interval server error" });
  }
};

exports.getUserMatchHistory = async (req, res, next) => {
  try {
    const summonerId = req.summonerId;
    const gameName = req.gameName;
    const tagLine = req.tagLine;
    const rankInfo = req.rankInfo;
    const puuid = req.puuid;
    const region = req.region;

    console.log("rank Info > ", rankInfo);

    // 해당 유저의 총 전적
    const totalGame = rankInfo.wins + rankInfo.losses;

    const matchUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=${totalGame}&api_key=${process.env.API_KEY}`;

    //해당 유저의 모든 게임 리스트 반환
    const matchList = await axios.get(matchUrl);

    req.summonerId = summonerId;
    req.gameName = gameName;
    req.tagLine = tagLine;
    req.puuid = puuid;
    req.matchList = matchList.data;
    req.region = region;
    req.rankInfo = rankInfo;

    next(); //next to getUserMatchDetails
  } catch (err) {
    console.log("error > ", err);
    res.status(500).json({ message: "interval server error" });
  }
};

exports.getUserMatchDetails = async (req, res) => {
  try {
    const summonerId = req.summonerId;
    const gameName = req.gameName;
    const tagLine = req.tagLine;
    const puuid = req.puuid;
    const region = req.region;
    const matchList = req.matchList; // 0번이 가장 최근게임(랭크, 일반 둘 다 포함)
    const rankInfo = req.rankInfo;

    const matchDetailsUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/${matchList[0]}?api_key=${process.env.API_KEY}`;
    const matchDetail = await axios.get(matchDetailsUrl);

    //console.log("queid >", matchDetail.data.info.queueId);

    // create DB
    const userData = {
      region: region,
      summonerId: summonerId,
      //matchList: matchList, 얘를 넣을때 문제있음
      puuid: puuid,
      gameName: gameName,
      tagLine: tagLine,
      wins: rankInfo.wins,
      losses: rankInfo.losses,
      tier: rankInfo.tier,
      rank: rankInfo.rank,
    };
    const newUser = await userService.createUser(userData);
    console.log("newUser > ", newUser);

    res.send(newUser);
  } catch (err) {}
};
