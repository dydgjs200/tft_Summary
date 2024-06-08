"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn("users", "accountId");
        await queryInterface.renameTable("users", "user");
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn("user", "accountId", Sequelize.STRING);
    },
};
