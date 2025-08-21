const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

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

module.exports = Feedback