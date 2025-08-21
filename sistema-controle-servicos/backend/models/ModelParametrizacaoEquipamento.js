const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

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

module.exports = ParametrizacaoEquipamento