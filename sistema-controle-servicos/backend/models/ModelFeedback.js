const DataTypes = require('sequelize')
const sequelize = require('../db')
const Servico = require('./ModelServico')
const Funcionario = require('./ModelFuncionario')

const Feedback = sequelize.define('Feedback',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    id_servico:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    id_funcionario:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    comentario: DataTypes.TEXT,
    data: DataTypes.DATEONLY
},
{
    tableName: 'feedback',
    timestamps:false
}
)

Feedback.belongsTo(Servico, {foreignKey: 'id_servico'})
Feedback.belongsTo(Funcionario, {foreignKey:'id_funcionario'})

module.exports = Feedback