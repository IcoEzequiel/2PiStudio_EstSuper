const Sequelize = require('sequelize')

const sequelize = new Sequelize('sistema_servicos','root','senha',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;