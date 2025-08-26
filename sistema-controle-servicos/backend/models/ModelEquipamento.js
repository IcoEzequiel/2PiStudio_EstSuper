const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

const Equipamento = sequelize.define('Equipamentos', {
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
    status: DataTypes.ENUM('ativo','inativo')
},
{
    tableName: 'Equipamentos',
    timestamps: false
}
)

module.exports = Equipamento