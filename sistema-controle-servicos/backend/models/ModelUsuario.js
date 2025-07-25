const DataTypes = require('sequelize')
const sequelize = require('../db')
const Funcionario = require('./ModelFuncionario')

const Usuario = sequelize.define("Usuario",{
    id:{
        type: DataTypes.INTEGER,
        autoIncremet: true,
        primaryKey:true
    },
    id_funcionario: DataTypes.INTEGER,
    papel: DataTypes.ENUM('funcionario','administrador'),
    login:{
        type: DataTypes.STRING,
        allowNull: false
    },
    senha:{
        type: DataTypes.STRING,
        allownull: false
    }
},
{
    tableName: 'usuarios',
    timestamps:false
}
)

Usuario.belongsTo(Funcionario, {foreignKey: 'id_funcionario'})

module.exports = Usuario