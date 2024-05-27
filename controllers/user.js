const axios = require("axios");

exports.getAllUsers = (req, res) => {
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]);
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
    const rankInfo = req.rankInfo;
    const puuid = req.puuid;
    const region = req.region;

    // 해당 유저의 총 전적
    const totalGame = rankInfo.wins + rankInfo.losses;

    const matchUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=${totalGame}&api_key=${process.env.API_KEY}`;

    //해당 유저의 모든 게임 리스트 반환
    const matchList = await axios.get(matchUrl);
    req.matchList = matchList.data;
    req.region = region;

    next();
  } catch (err) {
    console.log("error > ", err);
    res.status(500).json({ message: "interval server error" });
  }
};

exports.getUserMatchDetails = async (req, res) => {
  try {
    const region = req.region;
    const matchList = req.matchList; // 0번이 가장 최근게임(랭크, 일반 둘 다 포함)
    console.log("matchList[0] > ", matchList[0]);

    const matchDetailsUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/${matchList[0]}?api_key=${process.env.API_KEY}`;
    const matchDetail = await axios.get(matchDetailsUrl);

    //console.log("matchDetail > ", matchDetail.data.info);
    //console.log("parti > ", matchDetail.data.info.participants);
    console.log("queid >", matchDetail.data.info.queueId);

    res.send(matchDetail);
  } catch (err) {}
};
