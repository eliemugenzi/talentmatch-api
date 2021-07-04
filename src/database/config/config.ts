const pool = {
  max: 5,
  min: 0,
  acquire: 60000,
  idle: 10000,
};

const config = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    pool,
  },
  test: {
    use_env_variable: 'DATABASE_URL_TEST',
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    pool,
  },
  staging: {
    logging: false,
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    pool,
  },
  production: {
    logging: false,
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    pool,
    dialectOptions: {
      ssl: true,
    },
  },
};

// export default config;

module.exports = config;
