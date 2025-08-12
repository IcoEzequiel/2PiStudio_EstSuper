const DataTypes = require('sequelize')
const sequelize = require('../db')
const Funcionario = require('./ModelFuncionario')

const ParametrizacaoFuncionario = sequelize.define('ParametrizacaoFuncionario',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    id_funcionario:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valor_diaria: DataTypes.DECIMAL(10,2)
},
{
    tableName:'parametrizacao_funcionarios',
    timestamps:false
})

ParametrizacaoFuncionario.belongsTo(Funcionario, {foreignKey:'id_funcionario', as: 'funcionario'})

module.exports = ParametrizacaoFuncionario