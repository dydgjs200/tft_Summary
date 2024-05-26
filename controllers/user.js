const axios = require("axios");

exports.getAllUsers = (req, res) => {
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]);
};

exports.getUserInfo = async (req, res) => {
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

    res.send(rankInfo);
  } catch (err) {
    console.log("error > ", err);
    res.status(500).json({ message: "interval server error" });
  }
};
