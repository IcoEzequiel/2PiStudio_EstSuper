const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Modelo do Feedback, relacionado ao serviço que um funcionario prestou,, ele pega esses dados a partir da tabela
// Alocação de funcionarios, que já possui o serviço e o funcionario.
const Feedback = sequelize.define('Feedback',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    id_alocacaoFuncionario:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    comentario: DataTypes.TEXT,
    data: DataTypes.DATEONLY,
    status: {
        type: DataTypes.ENUM('pendente','respondido'),
        defaultValue: 'pendente'
    }
},
    // Como estamos usando o sequelise para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
{
    tableName: 'feedback',
    timestamps:false
}
)

module.exports = Feedback