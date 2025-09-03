const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Model da parametrização de Funcionario, o valor base para referencia na hora de alocar um funcionario para
// um serviço, o usuario pode mudar esse valor para serviços especificos a vontade dele,
// que vai ser salvo em Alocação de funcionario
const ParametrizacaoFuncionario = sequelize.define('ParametrizacaoFuncionario',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    id_funcionario:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // O valor do funcionario é cobrado por dia.
    valor_diaria: DataTypes.DECIMAL(10,2)
},
    // Como estamos usando o sequelise para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
{
    tableName:'parametrizacao_funcionarios',
    timestamps:false
})

module.exports = ParametrizacaoFuncionario