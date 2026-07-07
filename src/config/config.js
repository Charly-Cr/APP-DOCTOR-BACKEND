require('pg');
require('pg-hstore');
require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL_DEV',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DATABASE_URL_TEST',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT || 5432,
    // dialect: 'postgres',
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
    pool: {
      max: 5,        // máximo 5 conexiones
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  },
};