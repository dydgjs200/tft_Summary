"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      gameName: DataTypes.STRING,
      tagLine: DataTypes.STRING,
      area: DataTypes.STRING,
      puuid: DataTypes.STRING,
      summonerId: DataTypes.STRING,
      accountId: DataTypes.STRING,
      profileIconId: DataTypes.STRING,
      tier: DataTypes.STRING,
      rank: DataTypes.STRING,
      leaguePoints: DataTypes.INTEGER,
      wins: DataTypes.INTEGER,
      losses: DataTypes.INTEGER,
      matchList: DataTypes.ARRAY(DataTypes.STRING), // 배열 타입으로 지정
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
