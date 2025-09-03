const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Model dos usaurios, que vai mexer no sistema
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
    // Como estamos usando o sequelise para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
{
    tableName: 'usuarios',
    timestamps:false
}
)

module.exports = Usuario