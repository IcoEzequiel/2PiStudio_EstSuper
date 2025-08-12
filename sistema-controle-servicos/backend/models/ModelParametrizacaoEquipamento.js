const DataTypes = require('sequelize')
const sequelize = require('../db')
const Equipamento = require('./ModelEquipamento')

const ParametrizacaoEquipamento = sequelize.define('ParametrizacaoEquipamento',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    id_equipamento:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valor_hora: DataTypes.DECIMAL(10,2)
},
{
    tableName:'parametrizacao_equipamentos',
    timestamps:false
}
)

ParametrizacaoEquipamento.belongsTo(Equipamento, { foreignKey: 'id_equipamento', as: 'equipamento'});

module.exports = ParametrizacaoEquipamento