const DataTypes = require('sequelize')
const sequelize = require('../db')

const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipo_cliente:{
        type: DataTypes.ENUM('fisico','juridico'),
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull:false
    },
    cpf_cnpj: {
        type: DataTypes.STRING(30),
        allowNull:false
    },
    email: {
        type: DataTypes.STRING
    },
    telefone: {
        type: DataTypes.STRING(15)
    }
},
    {
        tableName: 'Clientes',
        timestamps: false
});

module.exports = Cliente;