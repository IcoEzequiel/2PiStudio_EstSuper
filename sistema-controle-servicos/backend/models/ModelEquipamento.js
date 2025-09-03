const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Model de equipamento e seus dados
const Equipamento = sequelize.define('Equipamentos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: DataTypes.STRING,
    descricao: DataTypes.TEXT,
    // Inativo é util para quando um equipamento for deletado mas ele já foi alocado em um Serviço, apenas transforma ele
    // em inativo para não excluir os dados do serviço que ele ja foi alocado.
    status: DataTypes.ENUM('ativo','inativo')
},
    // Como estamos usando o sequelise para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
{
    tableName: 'Equipamentos',
    timestamps: false
}
)

module.exports = Equipamento