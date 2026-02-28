require('pg')
require('pg-hstore')

const { Sequelize } = require('sequelize');
require('dotenv').config();

//para leer los test mas claros 
const sequelize = new Sequelize(process.env.DATABASE_URL,{logging: false});

module.exports = sequelize;
