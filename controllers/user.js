const axios = require("axios");

exports.getAllUsers = (req, res) => {
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]);
};

exports.getUserInfo = async (req, res) => {
  try {
    const { gameName } = encodeURIComponent(req.params);
    const region = req.body.region;
    const tagLine = req.body.tagLine;
    const accountUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${process.env.API_KEY}`;

    const getPuuid = await axios.get(accountUrl).then((response) => {
      console.log("response > ", response.data);
    });
    console.log(getPuuid); //why undefined?

    res.send(getPuuid);
  } catch (err) {
    console.log("error > ", err);
    res.status(500).json({ message: "interval server error" });
  }
};
