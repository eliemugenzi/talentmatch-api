'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('applications', 'job_id', {
      type: Sequelize.BIGINT,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('applications', 'job_id');
  },
};
