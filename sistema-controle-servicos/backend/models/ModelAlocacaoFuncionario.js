const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Modelo de Alocação de Funcionario, responsavel por informar que Funcionario foi alocado para determinado serviço
// em determinado dia e por quantas horas. É necessario uma alocação por dia pelo modelo atual
const AlocacaoFuncionario = sequelize.define('AlocacaoFuncionario',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_funcionario:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    id_servico:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    // Informa o dia que o funcionario foi alocado
    data: DataTypes.DATEONLY,
    // Informa por quantas horas ele trabalhou (não à uma necessidade direta disso)
    hora: DataTypes.INTEGER,
    // Valor da diaria desse funcionario, o padrão era para ser a parametrização, mas o usuario pode alterar o valor se desejar
    valor_dia_alocado: DataTypes.DECIMAL(10,2)
},
{
    // Como estamos usando o sequelise para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
    tableName: 'alocacao_funcionarios',
    timestamps: false
})

module.exports = AlocacaoFuncionario