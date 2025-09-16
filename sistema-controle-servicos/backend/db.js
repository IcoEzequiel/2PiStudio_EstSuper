const {Sequelize} = require('sequelize')

require('dotenv').config()
// banco de dados de testes
const dbName = process.env.NODE_ENV === 'test'
? process.env.DB_NAME_TEST
: process.env.DB_NAME_DEV

// Configuração do banco de dados
const sequelize = new Sequelize(
    dbName,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
});

module.exports = {sequelize, Sequelize}; 