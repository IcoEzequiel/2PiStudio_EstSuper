const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

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

module.exports = AlocacaoFuncionario