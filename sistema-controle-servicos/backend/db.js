const {Sequelize} = require('sequelize')

// banco de dados de testes
const dbTeste = process.NODE_ENV === 'test'
? 'sistema_servicos_test'
: 'sistema_servicos'

// Configuração do banco de dados
const sequelize = new Sequelize(dbTeste,'root','senha',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = {sequelize, Sequelize};