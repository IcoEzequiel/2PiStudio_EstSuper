const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Model de serviço, o principal do sistema
const Servico = sequelize.define('Servico',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome:DataTypes.STRING,
    descricao: DataTypes.TEXT,
    data_inicio:DataTypes.DATEONLY,
    data_fim: DataTypes.DATEONLY,
    // O status cancelado na verdade nunca vai ser usado, pos ele é deletado
    status: {
        type: DataTypes.ENUM('agendado','em execução','concluido','cancelado')
    },
    orcamento: DataTypes.DECIMAL(10,2),
    imposto: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},
    // Como estamos usando o sequelise para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
    {
        tableName: 'Servicos',
        timestamps: false
    }
)

module.exports = Servico;