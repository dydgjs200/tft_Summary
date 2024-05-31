'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    gameName: DataTypes.STRING,
    tagLine: DataTypes.STRING,
    region: DataTypes.STRING,
    puuid: DataTypes.STRING,
    summonerId: DataTypes.STRING,
    accountId: DataTypes.STRING,
    profileIconId: DataTypes.STRING,
    tier: DataTypes.STRING,
    rank: DataTypes.STRING,
    leaguePoints: DataTypes.INTEGER,
    wins: DataTypes.INTEGER,
    losses: DataTypes.INTEGER,
    matchList: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};