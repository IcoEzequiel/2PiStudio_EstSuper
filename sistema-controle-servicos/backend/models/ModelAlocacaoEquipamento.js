const DataTypes = require('sequelize')
const sequelize = require('../db')
const Equipamaneto = require('./ModelEquipamento')
const Servico = require('./ModelServico')

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

AlocacaoEquipamento.belongsTo(Equipamaneto, {foreignKey:"id_equipamento"})
AlocacaoEquipamento.belongsTo(Servico, {foreignKey:'id_servico'})

module.exports = AlocacaoEquipamento