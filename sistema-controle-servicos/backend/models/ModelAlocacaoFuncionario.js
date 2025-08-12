const DataTypes = require('sequelize')
const sequelize = require('../db')
const Funcionario = require('./ModelFuncionario')
const Servico = require('./ModelServico')

const AlocacaoFuncionario = sequelize.define('AlocacaoFuncionario',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_funcionario:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    id_servico:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    data: DataTypes.DATEONLY,
    hora: DataTypes.INTEGER,
    valor_dia_alocado: DataTypes.DECIMAL(10,2)
},
{
    tableName: 'alocacao_funcionarios',
    timestamps: false
})

AlocacaoFuncionario.belongsTo(Funcionario, {foreignKey:'id_funcionario',as: 'funcionario'})
AlocacaoFuncionario.belongsTo(Servico, {foreignKey:'id_servico', as: 'servico'})

module.exports = AlocacaoFuncionario