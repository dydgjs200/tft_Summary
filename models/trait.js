"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
  class Trait extends Model {
    static associate(models) {}
  }

  Trait.init(
    {
      Name: DataTypes.STRING,
      Info: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Trait",
      tableName: "trait",
    },
  );
  return Trait;
};
