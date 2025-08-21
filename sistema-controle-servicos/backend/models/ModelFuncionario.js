const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize


const Funcionario = sequelize.define('Funcionario',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf:{
        type: DataTypes.STRING(15),
        allowNull:false
    },
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    cargo: DataTypes.STRING,
    status: DataTypes.ENUM('ferias','operacional')
},
{
    tableName: "funcionarios",
    timestamps:false
}
)
// Necessario para quando o service chama uma parametrização junto com o funcionario

module.exports = Funcionario