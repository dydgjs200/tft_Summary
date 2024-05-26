const request = require("request");
const urlencode = require("urlencode");
const express = require("express");
const app = express();
const dotenv = require("dotenv");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// swagger import
const { swaggerUi, specs } = require("./Swagger/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// env import
dotenv.config();

// routes import
const userRoutes = require("./routes/user/index");
app.use("/user", userRoutes);

const port = process.env.PORT;
const tagLine = process.env.TAGLINE;
const gameName = encodeURIComponent(process.env.GAMENAME); //한글 아이디 encode 해서 주소값으로 변경
const apiKey = process.env.API_KEY;

var url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${apiKey}`;
var info;

request(url, function (err, res, body) {
  info = JSON.parse(body);
  var key = Object.keys(info);
  //   var result = "id : " + info[key]["id"];

  console.log(info);
});

app.get("/", (req, res) => {
  res.send(info);
});

app.listen(port, () => {
  console.log("서버 실행");
});
