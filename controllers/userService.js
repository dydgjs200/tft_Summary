const { where } = require("sequelize");
const { User } = require("../models");

const findgameName = async (gameName) => {
  return await User.findOne({ where: { gameName: gameName } });
};

const createUser = async (userData) => {
  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  findgameName,
  createUser,
};
