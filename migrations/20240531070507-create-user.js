"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("user", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            gameName: {
                type: Sequelize.STRING,
            },
            tagLine: {
                type: Sequelize.STRING,
            },
            region: {
                type: Sequelize.STRING,
            },
            puuid: {
                type: Sequelize.STRING,
            },
            summonerId: {
                type: Sequelize.STRING,
            },
            accountId: {
                type: Sequelize.STRING,
            },
            profileIconId: {
                type: Sequelize.STRING,
            },
            tier: {
                type: Sequelize.STRING,
            },
            rank: {
                type: Sequelize.STRING,
            },
            leaguePoints: {
                type: Sequelize.INTEGER,
            },
            wins: {
                type: Sequelize.INTEGER,
            },
            losses: {
                type: Sequelize.INTEGER,
            },
            matchList: {
                type: Sequelize.JSON,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("user");
    },
};
