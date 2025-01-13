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
  console.log("Request Body:", req.body);

  try {
    const gameName = decodeURIComponent(req.params.gameName);
    const { region, tagLine } = req.body;

    const user = await userService.findgameName(gameName);

    if (user) {
      return res.send(user); // 유저 정보 반환
    }

    // 유저가 없을 경우 다음 단계로 이동
    req.gameName = gameName;
    req.region = region;
    req.tagLine = tagLine;
    next();
  } catch (err) {
    console.error("findUser error:", err);
    res.status(500).json({ message: "Server error while finding user." });
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    const { gameName, region, tagLine } = req;

    // gameName + tagLine을 이용한 puuid
    const accountUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${process.env.API_KEY}`;
    const getPuuid = await axios.get(accountUrl);
    const puuid = getPuuid.data.puuid;

    // puuid를 이용한 summonerId
    const summonerUrl = `https://kr.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${process.env.API_KEY}`;
    const getSummonerId = await axios.get(summonerUrl);
    const summonerId = getSummonerId.data.id; // summonerId = id
    const profileIconId = getSummonerId.data.profileIconId;

    // summonerId를 이용한 rank 찾기
    const rankUrl = `https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}?api_key=${process.env.API_KEY}`;
    const getRank = await axios.get(rankUrl);
    const rankInfo = getRank.data;

    req.profileIconId = profileIconId;
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
    const { puuid, region, rankInfo } = req;
    const totalGames = rankInfo.wins + rankInfo.losses;

    const matchUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=${totalGames}&api_key=${process.env.API_KEY}`;
    const matchResponse = await axios.get(matchUrl);

    req.matchList = matchResponse.data;
    next();
  } catch (err) {
    console.error("getUserMatchHistory error:", err.message);
    res.status(500).json({ message: "Failed to fetch match history." });
  }
};

exports.getUserMatchDetails = async (req, res) => {
  try {
    const {
      profileIconId,
      summonerId,
      gameName,
      tagLine,
      puuid,
      region,
      matchList,
      rankInfo,
    } = req;

    if (!matchList || matchList.length === 0) {
      return res
        .status(404)
        .json({ message: "No matches found for the user." });
    }

    const matchDetailsUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/${matchList[0]}?api_key=${process.env.API_KEY}`;
    const matchDetailResponse = await axios.get(matchDetailsUrl);

    const userData = {
      profileIconId,
      region,
      summonerId,
      matchList,
      puuid,
      gameName: decodeURIComponent(gameName),
      tagLine,
      leaguePoints: rankInfo.leaguePoints,
      wins: rankInfo.wins,
      losses: rankInfo.losses,
      tier: rankInfo.tier,
      rank: rankInfo.rank,
    };

    const newUser = await userService.createUser(userData);
    res.send(newUser);
  } catch (err) {
    console.error("getUserMatchDetails error:", err.message);
    res.status(500).json({ message: "Failed to fetch match details." });
  }
};
