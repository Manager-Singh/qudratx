'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('business_activity', 'activity_name', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn('business_activity', 'activity_name_arabic', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.changeColumn('business_activity', 'activity_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('business_activity', 'activity_name_arabic', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
