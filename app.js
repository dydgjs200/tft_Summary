const request = require("request");
const urlencode = require("urlencode");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const sequelize = require("./models/index");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors import
app.use(cors());

// swagger import
const { swaggerUi, specs } = require("./Swagger/swagger");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

// env import
dotenv.config();

// routes import
const userRoutes = require("./routes/user/index");
const traitRoutes = require("./routes/trait/index");
app.use("/user", userRoutes);
app.use("/trait", traitRoutes);

// views import
const path = require("path");
app.use(express.static(path.join(__dirname, "views")));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`${port} 로 서버 실행`);
});
