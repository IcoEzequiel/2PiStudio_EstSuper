const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

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

module.exports = ParametrizacaoFuncionario