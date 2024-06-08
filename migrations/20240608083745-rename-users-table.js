"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 테이블 이름 변경 (users -> user)
    await queryInterface.renameTable("users", "user");
  },

  async down(queryInterface, Sequelize) {
    // 롤백 시 테이블 이름 변경 (user -> users)
    await queryInterface.renameTable("user", "users");
  },
};
