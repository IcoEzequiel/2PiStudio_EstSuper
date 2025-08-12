const DataTypes = require('sequelize')
const sequelize = require('../db')
const Cliente = require('./ModelCliente')

const Servico = sequelize.define('Servico',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome:DataTypes.STRING,
    descricao: DataTypes.TEXT,
    data_inicio:DataTypes.DATEONLY,
    data_fim: DataTypes.DATEONLY,
    tempo_expediente: DataTypes.INTEGER,
    status: {
        type: DataTypes.ENUM('agendado','em execução','concluido')
    },
    orcamento: DataTypes.DECIMAL(10,2)
},
    {
        tableName: 'Servicos',
        timestamps: false
    }
)

Servico.belongsTo(Cliente, {foreignKey: 'id_cliente', as:'cliente'});

module.exports = Servico;