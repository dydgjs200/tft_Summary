const request = require("request");
const urlencode = require("urlencode");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const sequelize = require("./models/index");

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
app.listen(port, () => {
  console.log("서버 실행");
});
