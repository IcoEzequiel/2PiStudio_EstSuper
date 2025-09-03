const {sequelize, Sequelize} = require('../db')
const {DataTypes} = Sequelize

// Modelo de Alocação de Equipamento, responsavel por informar que equipamento foi alocado para determinado serviço
// em determinado dia e por quantas horas. É necessario uma alocação por dia pelo modelo atual
const AlocacaoEquipamento = sequelize.define('AlocacaoEquipamento',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_equipamento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_servico:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Dia que o equipamento foi alocado
    data: DataTypes.DATEONLY,
    // Por quantas horas ele foi Utilizado 
    // (util para calcuar o valor a cobra nesse dia, pos o equipamento é calculado por horas)
    hora: DataTypes.INTEGER,
    // Valor cobrado por hora desse equipamento, o usuario pode alterar o valor, mas o padrão era para ser a da parametrização
    valor_hora_alocada: DataTypes.DECIMAL(10,2)
},
{
    // Como estamos usando o sequelise para definir o model, temos que informar o nome da tabela (de preferencia o mesmo do 
    // banco de dados), e definir o timestamps para falso (timestamps são campos para informar quando a instancia foi criada
    // e qual a ultima data que ela foi alterada)
    tableName: "alocacao_equipamentos",
    timestamps: false
}
)

module.exports = AlocacaoEquipamento