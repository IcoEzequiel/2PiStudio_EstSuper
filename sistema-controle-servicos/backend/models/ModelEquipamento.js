const DataTypes = require('sequelize')
const sequelize = require('../db')

const Equipamaneto = sequelize.define('Equipamentos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: DataTypes.STRING,
    descricao: DataTypes.TEXT,
    status: DataTypes.ENUM('operacional','quebrado')
},
{
    tableName: 'Equipamentos',
    timestamps: false
}
)

module.exports = Equipamaneto