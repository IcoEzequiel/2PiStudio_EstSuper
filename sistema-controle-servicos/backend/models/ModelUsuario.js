const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

const Usuario = sequelize.define("Usuario",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
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

module.exports = Usuario