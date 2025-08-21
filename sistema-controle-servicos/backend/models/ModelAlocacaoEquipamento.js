const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

const AlocacaoEquipamento = sequelize.define('AlocacaoEquipamento',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_equipamento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_servico:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data: DataTypes.DATEONLY,
    hora: DataTypes.INTEGER,
    valor_hora_alocada: DataTypes.DECIMAL(10,2)
},
{
    tableName: "alocacao_equipamentos",
    timestamps: false
}
)

module.exports = AlocacaoEquipamento